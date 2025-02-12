<?php
class Reports {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getTables() {
        $sql = "SELECT 
                table_name,
                CASE table_name
                    WHEN 'producto' THEN 'Productos'
                    WHEN 'funcionario' THEN 'Empleados'
                    WHEN 'cliente' THEN 'Clientes'
                    WHEN 'direccion' THEN 'Direcciones'
                    WHEN 'pago' THEN 'Pagos'
                    WHEN 'pedido' THEN 'Pedidos'
                    WHEN 'cliente_mesa' THEN 'Reservas'
                    WHEN 'mesa_pedido' THEN 'Pedidos entrgado en mesa'
                    WHEN 'producto_categoria' THEN 'Categorías de Productos'
                    WHEN 'pedido_auditoria' THEN 'Auditoría de Pedidos'
                    WHEN 'factura_auditoria' THEN 'Auditoría de Facturas'
                    WHEN 'pago_auditoria' THEN 'Auditoria de Pagos'
                    WHEN 'pedido_producto' THEN 'Productos en Pedidos'
                    WHEN 'pedido_ingrediente' THEN 'Ingredientes en Pedidos'
                    WHEN 'producto_ingrediente' THEN 'Ingredientes de Productos'
                    WHEN 'factura' THEN 'Facturas'
                    ELSE table_name  -- Si hay alguna tabla que no está en la lista, mantiene su nombre original
                END AS Tablas
            FROM information_schema.tables
            WHERE table_schema = 'chefhub_db'
            AND table_name IN (
                'factura',
                'producto',
                'funcionario',
                'cliente',
                'direccion',
                'pago',
                'pedido',
                'cliente_mesa',
                'mesa_pedido',
                'producto_categoria',
                'pedido_auditoria',
                'factura_auditoria',
                'pago_auditoria',
                'pedido_producto',
                'pedido_ingrediente',
                'producto_ingrediente'
            );";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    }

    public function getColumns($tables) {
        // Crear los placeholders para las tablas
        $placeholders = implode(',', array_fill(0, count($tables), '?'));
        
        // Consulta para obtener columnas y claves primarias
        $sql = "
            SELECT c.table_name, c.column_name, pk.column_name AS primary_key, c.data_type
            FROM information_schema.columns c
            LEFT JOIN information_schema.key_column_usage pk
                ON c.table_name = pk.table_name
                AND c.table_schema = pk.table_schema
                AND pk.constraint_name = 'PRIMARY'
            WHERE c.table_schema = 'chefhub_db'
                AND c.table_name IN ($placeholders)
                AND c.column_name NOT IN ('baja')
                AND c.column_name NOT IN ('imagen');
        ";
    
        // Preparar y ejecutar la consulta
        $stmt = $this->conn->prepare($sql);
        foreach ($tables as $index => $table) {
            $stmt->bindValue($index + 1, $table, PDO::PARAM_STR);
        }
        $stmt->execute();
    
        // Obtener y devolver los resultados
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }    

    public function joinDuplicate($columns) {
        $uniqueColumns = [];
        $filteredColumns = [];
        foreach ($columns as $column) {
            if (!in_array($column['COLUMN_NAME'], $uniqueColumns)) {
                $uniqueColumns[] = $column['COLUMN_NAME'];
                $filteredColumns[] = $column;
            }
        }
        return $filteredColumns;
    }

    public function getJoinsForTable($tableName) {
        // Consulta para obtener las tablas a las que se le puede hacer JOIN
        $sql = "
            SELECT 
                DISTINCT REFERENCED_TABLE_NAME
            FROM 
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE 
                TABLE_SCHEMA = 'chefhub_db'
                AND REFERENCED_TABLE_NAME IS NOT NULL
                AND TABLE_NAME = :tableName;
        ";
    
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':tableName', $tableName, PDO::PARAM_STR);
        $stmt->execute();
    
        // Verificar si se obtuvieron resultados
        if ($stmt->rowCount() > 0) {
            $tables = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $tables[] = $row['REFERENCED_TABLE_NAME']; // Agregar tabla referenciada
            }
    
            return $tables; // Devolver solo las tablas con las cuales se puede hacer JOIN
        } else {
            return "No se encontraron tablas para hacer JOIN con la tabla '$tableName'";
        }
    }
    
    public function generateJoinQuery($table, $foreignKeys, $columns, $conditions, $classification) {
        // Verificamos si $foreignKeys es un array. Si no lo es, lo inicializamos como un array vacío.
        if (!is_array($foreignKeys)) {
            $foreignKeys = [];
        }
    
        // Iniciar la consulta SQL con el SELECT
        $sql = "SELECT ";
    
        // Construcción de la lista de columnas
        $selectColumns = [];
        $groupByColumns = [];
        $classificationColumns = [];
        foreach ($columns as $index => $column) {
            $colName = "{$column['TABLE_NAME']}.{$column['COLUMN_NAME']}";
            $selectColumns[] = $colName;
    
            // Si la clasificación es GROUP BY, agregamos la columna al grupo
            if (!empty($classification) && isset($classification[0]['type']) && $classification[0]['type'] === 'GROUP BY') {
                $groupByColumns[] = $colName;
            }
        }
    
        // Si hay funciones de agregación, las agregamos
        if (!empty($classification) && isset($classification[0]['type']) && in_array($classification[0]['type'], ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'])) {
            $aggregationType = $classification[0]['type'];
            $aggregationColumn = "{$classification[0]['table']}.{$classification[0]['column']}"; 
            $selectColumns[] = "$aggregationType($aggregationColumn) AS 'Suma Total'";
        }

    
        // Unir las columnas en la consulta sin coma adicional al final
        $sql .= implode(", ", $selectColumns);
    
        // Añadir la tabla principal al FROM
        $sql .= " FROM $table";
    
        // Iterar sobre las claves foráneas para construir los JOINs
        foreach ($foreignKeys as $foreignKeyObj) {
            $foreignKey = $foreignKeyObj['foreign_key'];  // Obtener el nombre de la clave foránea
    
            // Buscar la tabla y la clave primaria correspondientes a la clave foránea
            foreach ($columns as $column) {
                $tableName = $column['TABLE_NAME'];  // Tabla relacionada
                $primaryKey = $column['primary_key'];  // Clave primaria de la tabla relacionada
    
                // Solo hacer JOIN si la clave foránea coincide con la clave primaria
                if ($tableName !== $table && $foreignKey === $primaryKey) {
                    // Realizar el JOIN con la tabla correspondiente
                    $sql .= " JOIN $tableName ON $table.$foreignKey = $tableName.$primaryKey";
                    break; // Romper el bucle cuando se encuentre la clave correspondiente
                }
            }
        }
    
        // Añadir las condiciones (WHERE) si existen
        if (!empty($conditions)) {
            $sql .= " WHERE ";
    
            // Recorremos las condiciones y las agregamos
            $conditionParts = [];
            foreach ($conditions as $index => $condition) {
                $column = $condition['column'];
                $operator = $condition['operator'];
                $value = $condition['value'];
                $logicalOperator = isset($condition['logicalOperator']) ? $condition['logicalOperator'] : ''; // Si no se especifica operador lógico, dejar vacío
                $columnTable = $condition['table'];
    
                // Ajustar operadores especiales como LIKE, BETWEEN, etc.
                if (in_array($operator, ['LIKE', 'contains'])) {
                    $operator = 'LIKE';
                    $value = "%" . $value . "%";
                } elseif ($operator == 'STARTSWITH') {
                    $operator = 'LIKE';
                    $value = $value . "%";
                } elseif ($operator == 'ENDSWITH') {
                    $operator = 'LIKE';
                    $value = "%" . $value;
                }
    
                // Formar la condición en la SQL
                if ($operator == 'between') {
                    // Ejemplo de BETWEEN (suponiendo que el valor sea 'start,end')
                    $values = explode(',', $value);
                    $conditionParts[] = "$columnTable.$column BETWEEN '{$values[0]}' AND '{$values[1]}'";
                } else {
                    $conditionParts[] = "$columnTable.$column $operator '$value'";
                }
            }
    
            // Unir las condiciones con el operador lógico si es necesario
            if (!empty($conditionParts)) {
                $sql .= implode(" $logicalOperator ", $conditionParts);
            }
        }

        $classificationColumns = [];
        foreach ($classification as $index => $column) {
            $colName = "{$column['table']}.{$column['column']}";
            $classificationColumns[] = $colName;
        }

        if (!empty($classificationColumns)) {
            $groupByColumns = [];
            $orderByColumns = [];
            foreach ($classification as $class) {
            $colName = "{$class['table']}.{$class['column']}";
            if ($class['type'] === 'GROUP BY') {
                $groupByColumns[] = $colName;
            } else if ($class['type'] === 'ORDER BY ASC') {
                $orderByColumns[] = $colName . " ASC";
            } else if ($class['type'] === 'ORDER BY DESC') {
                $orderByColumns[] = $colName . " DESC";
            }
            }
            if (!empty($groupByColumns)) {
            $sql .= " GROUP BY " . implode(", ", $groupByColumns);
            }
            if (!empty($orderByColumns)) {
            $sql .= " ORDER BY " . implode(", ", $orderByColumns);
            }
        }
    
        return $sql; // Retornamos la consulta generada
    }             

    public function getForeignKeys($table) {
        // Consulta para obtener las claves foráneas de una tabla
        $sql = "
            SELECT 
                COLUMN_NAME AS foreign_key
            FROM 
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE 
                TABLE_SCHEMA = 'chefhub_db'
                AND TABLE_NAME = :table
                AND REFERENCED_TABLE_NAME IS NOT NULL;
        ";
    
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':table', $table, PDO::PARAM_STR);
        $stmt->execute();
    
        // Verificar si se obtuvieron resultados
        if ($stmt->rowCount() > 0) {
            $foreignKeys = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $foreignKeys[] = $row; // Agregar clave foránea
            }
    
            return $foreignKeys; // Devolver solo las claves foráneas
        } else {
            return "No se encontraron claves foráneas para la tabla '$table'.";
        }
    }

    public Function executeQuery($sql) {
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
}
?>