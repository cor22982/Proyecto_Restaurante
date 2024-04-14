import jsPDF from 'jspdf';
import 'jspdf-autotable';

const  GenerarFactura = (numeroFactura, cliente, jsonData, total) => {
  const doc = new jsPDF();

  // Título del documento
  doc.setFontSize(16);
  doc.text('Factura', 20, 20); // Título centrado a 20 puntos del borde superior

  // Información del cliente
  doc.setFontSize(12);
  doc.text(`Número de Factura: ${numeroFactura}`, 20, 30);
  doc.text(`Nombre: ${cliente.nombre}`, 20, 40);
  doc.text(`Dirección: ${cliente.direccion}`, 20, 50);
  doc.text(`NIt: ${cliente.nit}`, 20, 60);

  // Espacio entre la información del cliente y la tabla
  let posY = 70;

  // Agregar la tabla
  const columns = Object.keys(jsonData[0]);
  const rows = jsonData.map(obj => columns.map(key => obj[key]));

  doc.autoTable({
    head: [columns],
    body: rows,
    startY: posY // Posición vertical inicial de la tabla
  });

  // Calcular la posición para el total
  const finalY = doc.autoTable.previous.finalY;
  const actualPageHeight = doc.internal.pageSize.height;
  const finalPageHeight = actualPageHeight - finalY;
  let totalPosY = finalPageHeight < 40 ? actualPageHeight : finalY + 10;

  // Agregar el total
  doc.setFontSize(12);
  doc.text(`Total: ${total}`, 20, totalPosY);

  // Guardar el documento PDF
  doc.save(`factura_${numeroFactura}.pdf`);
}

export default GenerarFactura