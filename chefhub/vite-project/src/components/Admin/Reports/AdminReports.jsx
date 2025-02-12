import { useState, useEffect } from "react";
import { Button, Box, Flex, Text, Select, Input } from "@chakra-ui/react";
import '../apiService';
import { fetchData } from '../apiService';

export default function CustomReport() {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filters, setFilters] = useState([]);
  const [dateFilter, setDateFilter] = useState({ column: "", from: "", to: "" });
  const [availableColumns, setAvailableColumns] = useState([]);

  useEffect(() => {
    fetchData('http://localhost/api/reports/columnsdb', setAvailableColumns);
  }, []);

  const addColumn = (column) => {
    if (!selectedColumns.includes(column.COLUMN_NAME)) {
      setSelectedColumns([...selectedColumns, column.COLUMN_NAME]);
    }
  };

  const removeColumn = (column) => {
    setSelectedColumns(selectedColumns.filter((col) => col !== column));
  };

  const addFilter = () => {
    setFilters([...filters, { column: "", criteria: "", value: "" }]);
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Informe Personalizado
      </Text>

      {/* Selección de columnas */}
      <Flex gap={4}>
        <Box w="50%">
          <Text fontWeight="semibold">Columnas Disponibles</Text>
          <Box borderWidth={1} p={2} h={40} overflowY="auto">
            {availableColumns.map((col) => (
              <Flex 
                key={`${col.TABLE_NAME}_${col.COLUMN_NAME}`} 
                p={2} 
                cursor="pointer" 
                _hover={{ bg: "gray.100" }} 
                onClick={() => addColumn(col)}
              >
                <Text>{col.COLUMN_NAME}</Text>
              </Flex>
            ))}
          </Box>
        </Box>
        <Box w="50%">
          <Text fontWeight="semibold">Mostrar Columnas</Text>
          <Box borderWidth={1} p={2} h={40} overflowY="auto">
            {selectedColumns.map((col, index) => (
              <Flex key={`${col}_${index}`} justify="space-between" p={2}>
                <Text>{col}</Text>
                <Button size="sm" onClick={() => removeColumn(col)}>✖</Button>
              </Flex>
            ))}
          </Box>
        </Box>
      </Flex>

      {/* Filtro de Fechas */}
      <Box mt={4}>
        <Text fontWeight="semibold">Filtro de Fechas</Text>
        <Flex gap={4} mt={2}>
          <Select onChange={(e) => setDateFilter({ ...dateFilter, column: e.target.value })}>
            <option value="">Seleccionar columna</option>
            {availableColumns.map((col) => (
              <option key={`${col.TABLE_NAME}_${col.COLUMN_NAME}`} value={col.COLUMN_NAME}>
                {col.COLUMN_NAME}
              </option>
            ))}
          </Select>
          <Input
            type="date"
            onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
          />
          <Input
            type="date"
            onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
          />
        </Flex>
      </Box>

      {/* Filtros avanzados */}
      <Box mt={4}>
        <Text fontWeight="semibold">Filtrado Avanzado</Text>
        {filters.map((filter, index) => (
          <Flex key={index} gap={4} mb={2}>
            <Select>
              <option value="">Seleccionar columna</option>
              {availableColumns.map((col) => (
                <option key={`${col.TABLE_NAME}_${col.COLUMN_NAME}`} value={col.COLUMN_NAME}>
                  {col.COLUMN_NAME}
                </option>
              ))}
            </Select>
            <Select>
              <option value="">Seleccionar criterio</option>
              <option value="igual">Igual a</option>
              <option value="contiene">Contiene</option>
            </Select>
            <Input placeholder="Valor" />
          </Flex>
        ))}
        <Button onClick={addFilter} mt={2}>Agregar Filtro</Button>
      </Box>
    </Box>
  );
}
