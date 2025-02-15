import { useState, useEffect } from "react";
import "../apiService";
import { fetchData, postData } from "../apiService";
import './AdminReports.css';
import jsPDF from "jspdf";
import "jspdf-autotable";


export default function CustomReport() {
  const [columns, setColumns] = useState([]); // Columnas disponibles
  const [availableColumns, setAvailableColumns] = useState([]); // Columnas disponibles
  const [availableTables, setAvailableTables] = useState([]); // Tablas disponibles
  const [selectedTable, setSelectedTable] = useState(""); // Tabla seleccionada
  const [selectedColumns, setSelectedColumns] = useState([]); // Columnas seleccionadas
  const [reportData, setReportData] = useState([]); // Datos del informe
  const [conditions, setConditions] = useState([]); // Condiciones de filtrado
  const [classificationType, setClassificationType] = useState(""); // Estado para la clasificación
  const [classificationColumn, setClassificationColumn] = useState(null); // Estado para la columna de clasificación
  const [classifications, setClassifications] = useState([]); // Agregar estado para las clasificaciones
  const [columnsTable, setColumnsTable] = useState([]);
  const [isColumnDisabled, setIsColumnDisabled] = useState(true);

  useEffect(() => {
    fetchData("http://192.168.0.10:8080/api/reports/tables", setAvailableTables);
  }, []);

  const handleTableChange = (event) => {
    const newTable = event.target.value;
    setSelectedTable(newTable);
    setSelectedColumns([]); 
  
    if (newTable !== "") {
      fetchData(`http://192.168.0.10:8080/api/reports/columns/${newTable}`, (data) => {
        const uniqueColumns = [...new Map(data.map(col => [col.COLUMN_NAME, col])).values()];
        setAvailableColumns(uniqueColumns);
        setColumns(uniqueColumns);
        console.log('Columnas:', uniqueColumns);
      });
    }
  };  

  const handleSelectColumn = (column) => {
    if (!selectedColumns.includes(column)) {
      setSelectedColumns([...selectedColumns, column]); // Agregar columna seleccionada
      setAvailableColumns(availableColumns.filter((col) => col.COLUMN_NAME !== column.COLUMN_NAME)); // Quitar columna de las disponibles
    }
  };

  const handleRemoveColumn = (column) => {
    setSelectedColumns(selectedColumns.filter((col) => col.COLUMN_NAME !== column.COLUMN_NAME)); // Eliminar columna de las seleccionadas
    setAvailableColumns([...availableColumns, column]); // Agregar columna de vuelta a las disponibles
  };

  const handleRemoveCondition = (indexToRemove) => {
    const updatedConditions = conditions.filter((_, index) => index !== indexToRemove);
    setConditions(updatedConditions);
  };

  const handleAddCondition = () => {
    const newCondition = {
      column: null, // Ahora será un objeto completo
      operator: "",
      value: "",
      logicalOperator: ""
    };
    setConditions([...conditions, newCondition]);
  };

  const handleConditionChange = (index, field, value) => {
    const updatedConditions = [...conditions];
    const currentCondition = updatedConditions[index];
  
    if (field === "column") {
      const selectedColumn = columns.find(col => col.COLUMN_NAME === value);
      if (selectedColumn) {
        currentCondition.column = {
          name: selectedColumn.COLUMN_NAME,
          table: selectedColumn.TABLE_NAME,
          type: selectedColumn.DATA_TYPE
        };
        // Resetear valores al cambiar columna
        currentCondition.value = "";
        currentCondition.operator = "";
      }
    } else if (field === "value1" || field === "value2") {
      const values = currentCondition.value?.split(",") || ["", ""];
      values[field === "value1" ? 0 : 1] = value;
      currentCondition.value = values.join(",");
    } else {
      currentCondition[field] = value;
    }
  
    setConditions(updatedConditions);
  };

  const handleClassificationsChange = (event) => {
    setClassificationType(event.target.value);
    setIsColumnDisabled(false);
  };
  
  
  const handleClassificationColumnChange = (event) => {
    const columnName = event.target.value;
    const selectedColumn = columns.find((col) => col.COLUMN_NAME === columnName);
    
    if (selectedColumn) {
      setClassifications((prev) => [...prev, { type: classificationType, column: selectedColumn }]);
      setClassificationType("");
      setIsColumnDisabled(true);
    }
  };

  const getAvailableClassificationColumns = (type) => {
    // Filtra las columnas que ya están usadas en la misma clasificación
    const usedColumns = classifications
      .filter((cls) => cls.type === type)
      .map((cls) => cls.column.COLUMN_NAME);
  
    return columns.filter((col) => !usedColumns.includes(col.COLUMN_NAME));
  };
  
  
  const generateReport = () => {
    if (classifications.some(cls => !cls.type || !cls.column)) {
      alert("Debes completar todas las clasificaciones seleccionadas");
      return;
    }

    const data = {
      table: selectedTable,
      columns: selectedColumns,
      conditions: conditions.map(condition => ({
        column: condition.column?.name || "",
        table: condition.column?.table || selectedTable,
        operator: condition.operator,
        value: condition.value,
        logicalOperator: condition.logicalOperator,
        dataType: condition.column?.type || "text"
      })),
      classifications: classifications.map(cls => ({
        type: cls.type,
        column: cls.column.COLUMN_NAME,
        table: cls.column.TABLE_NAME
      }))
    };
  
    console.log('Generando informe:', data);
  
    postData("http://192.168.0.10:8080/api/reports/generatereport", data, (response) => {
      console.log('Informe generado:', response);
      if (response.success) {
        setReportData(response.data);
        
        // Tomar las columnas desde la respuesta de la API
        if (response.data.length > 0) {
          const extractedColumns = Object.keys(response.data[0]); 
          setColumnsTable(extractedColumns);
        }
      } else {
        alert('No se encontraron datos para el informe');
      }
    });
  };
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Reporte Generado", 10, 10);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 10, 20);

    if (reportData.length > 0) {
      const tableColumn = columnsTable;
      const tableRows = reportData.map((row) =>
        columnsTable.map((col) => row[col] || "")
      );

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: [255, 255, 255],
          fontSize: 12,
        },
        bodyStyles: {
          fontSize: 10,
        },
      });

      doc.save("informe.pdf");
    } else {
      alert("No hay datos para exportar.");
    }
  };
  

  return (
    <div className="container-reports">
      {/* Selector de tabla */}
      <label>Seleccionar Tabla:</label>
      <select onChange={handleTableChange} className="select-box-reports">
        <option value="">Seleccionar Tabla</option>
        {availableTables.map((table) => (
          <option key={table.TABLE_NAME} value={table.TABLE_NAME}>
            {table.Tablas}
          </option>
        ))}
      </select>

      {/* Columnas Disponibles y Seleccionadas */}
      <div className="columns-container-reports">
        <div className="column-box-reports">
          <h2 className="column-title-reports">Columnas Disponibles</h2>
          <ul className="column-list-reports">
            {availableColumns.map((column) => (
              <li
                key={column.COLUMN_NAME + column.TABLE_NAME}
                className="column-item-reports"
                onClick={() => handleSelectColumn(column)}
              >
                {column.COLUMN_NAME} ({column.TABLE_NAME})
              </li>
            ))}
          </ul>
        </div>

        <div className="column-box-reports">
          <h2 className="column-title-reports">Columnas Seleccionadas</h2>
          <ul className="column-list-reports">
            {selectedColumns.map((column) => (
              <li
              key={column.COLUMN_NAME + column.TABLE_NAME}
                className="column-item-reports selected-reports"
                onClick={() => handleRemoveColumn(column)}
              >
                {column.COLUMN_NAME} ({column.TABLE_NAME})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="reports-conditions">
        <label>Condiciones de Filtro:</label>
        
        {conditions.map((condition, index) => (
          <div key={index} className="condition-row">
                <button 
                  className="remove-condition-btn"
                  onClick={() => handleRemoveCondition(index)}
                  title="Eliminar condición"
                >
                  ×
                </button>
            {index > 0 && (
              <select
                value={condition.logicalOperator}
                onChange={(e) => handleConditionChange(index, 'logicalOperator', e.target.value)}
                className="logical-operator-select"
              >
                <option value="">Selecciona un operador lógico</option>
                <option value="AND">Y (AND)</option>
                <option value="OR">O (OR)</option>
              </select>
            )}
            <select
              value={condition.column?.name || ""}
              onChange={(e) => handleConditionChange(index, 'column', e.target.value)}
              className="filter-column-select"
            >
              <option value="">Selecciona una columna</option>
              {columns.map((column) => (
                <option key={column.COLUMN_NAME} value={column.COLUMN_NAME}>
                  {column.COLUMN_NAME} ({column.TABLE_NAME})
                </option>
              ))}
            </select>

            <select
              value={condition.operator}
              onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
              className="filter-condition-select"
            >
              <option value="">Selecciona una condición</option>
              <option value="=">Igual a (=)</option>
              <option value="!=">Distinto a (!=)</option>
              <option value=">">Mayor que (&gt;)</option>
              <option value="<">Menor que (&lt;)</option>
              <option value=">=">Mayor o igual que (&gt;=)</option>
              <option value="<=">Menor o igual que (&lt;=)</option>
              <option value="between">Entre (BETWEEN)</option> {/* falta arreglar */}
              <option value="LIKE">Contiene (LIKE)</option> 
              <option value="contains">Contiene (CONTAINS)</option> {/* falta arreglar */}
              <option value="STARTSWITH">Comienza con (STARTSWITH)</option>
              <option value="ENDSWITH">Termina con (ENDSWITH)</option>
              <option value="IS NULL">Es Nulo (IS NULL)</option>
              <option value="IS NOT NULL">No es Nulo (IS NOT NULL)</option>
            </select>

            {condition.operator === "between" && (
              <>
                <input
                  type={
                    condition.column?.type === "date" ? "date" :
                    condition.column?.type === "time" ? "time" : "text"
                  }
                  value={(condition.value?.split(",")[0] || "")}
                  onChange={(e) => handleConditionChange(index, 'value1', e.target.value)}
                  placeholder="Valor 1"
                />
                <input
                  type={
                    condition.column?.type === "date" ? "date" :
                    condition.column?.type === "time" ? "time" : "text"
                  }
                  value={(condition.value?.split(",")[1] || "")}
                  onChange={(e) => handleConditionChange(index, 'value2', e.target.value)}
                  placeholder="Valor 2"
                />
              </>
            )}

            {condition.operator !== "between" && (
              <input
                type={
                  condition.column?.type === "date" ? "date" :
                  condition.column?.type === "time" ? "time" : "text"
                }
                value={condition.value || ""}
                onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                placeholder="Valor"
              />
            )}
          </div>
        ))}
        <button onClick={handleAddCondition} className="add-condition-btn">
          Agregar Condición
        </button>
      </div>

      <div className="classifications-reports">
      <select value={classificationType} onChange={handleClassificationsChange}>
        <option value="">Selecciona una clasificación</option>
        <option value="GROUP BY">Agrupar por (GROUP BY)</option>
        <option value="ORDER BY ASC">
          Ordenar Ascendente (ORDER BY ASC)
        </option>
        <option value="ORDER BY DESC">
          Ordenar Descendente (ORDER BY DESC)
        </option>
        <option value="COUNT">Contar (COUNT)</option>
        <option value="SUM">Suma (SUM)</option>
        <option value="AVG">Promedio (AVG)</option>
        <option value="MIN">Mínimo (MIN)</option>
        <option value="MAX">Máximo (MAX)</option>
        <option value="HAVING">Filtro sobre agrupación (HAVING)</option>
      </select>


      <select
  onChange={handleClassificationColumnChange}
  disabled={isColumnDisabled}
>
  <option value="">Seleccionar Columna</option>
  {getAvailableClassificationColumns(classificationType).map((col) => (
    <option key={`${col.TABLE_NAME}_${col.COLUMN_NAME}`}>
      {col.COLUMN_NAME} ({col.TABLE_NAME})
    </option>
  ))}
</select>

    <div className="active-classifications">
  {classifications.map((cls, index) => (
    <div key={index} className="classification-tag">
      {cls.column?.TABLE_NAME}.{cls.column?.COLUMN_NAME} ({cls.type})
      <button 
        className="remove-classification-btn"
        onClick={() => setClassifications(classifications.filter((_, i) => i !== index))}
      >
        ×
      </button>
    </div>
  ))}
</div>
      </div>

      <button className="admin-btn" onClick={generateReport}>Generar Informe</button>

      {/* Mostrar los resultados en una tabla si existen */}
      {Array.isArray(reportData) && reportData.length > 0 && (
        <div className="report-table-container">
          <h2>Informe Generado</h2>
            <table className="report-table">
              <thead>
                <tr>
                  {columnsTable.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columnsTable.map((col, colIndex) => (
                      <td key={colIndex}>{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          <button className="admin-btn" onClick={exportToPDF}>Exportar a PDF</button>
        </div>
      )}
    </div>
  );
}
