import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoImage from '../assets/digitech-logo.jpg';

const loadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
  });
};

const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export const generateSubmissionsPDF = async (submissions, title, filename = 'submissions.pdf') => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    
    const logo = await loadImage(logoImage);

    let yPosition = 15;
    
    if (logo) {
      const logoWidth = 25;
      const logoHeight = (logo.height / logo.width) * logoWidth;
      doc.addImage(logo, 'JPEG', margin, 10, logoWidth, logoHeight);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30);
      doc.text("DIGITECH SOLUTIONS", margin + logoWidth + 5, 18);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin + logoWidth + 5, 23);
      
      yPosition = Math.max(25, 10 + logoHeight + 5);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text("DIGITECH SOLUTIONS", margin, 18);
      yPosition = 25;
    }

    doc.setDrawColor(200);
    doc.setLineWidth(0.1);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    submissions.forEach((submission, index) => {
      const rawName = submission.clientDetails?.userName || submission.clientID || 'Unknown';
      const clientName = toTitleCase(rawName);
      const dateStr = submission.createdAt ? new Date(submission.createdAt).toLocaleString([], {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'}) : 'N/A';
      
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFillColor(245, 247, 250);
      doc.rect(margin, yPosition - 4, pageWidth - (margin * 2), 10, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(40);
      doc.text(`${index + 1}. ${clientName}`, margin + 2, yPosition + 2);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(dateStr, pageWidth - margin - 2, yPosition + 2, { align: 'right' });
      
      yPosition += 8;

      if (submission.data && typeof submission.data === 'object') {
        const bodyData = Object.entries(submission.data).map(([k, v]) => [
          k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          typeof v === 'object' ? JSON.stringify(v) : String(v)
        ]);
        
        if (bodyData.length > 0) {
          autoTable(doc, {
            startY: yPosition,
            margin: { left: margin, right: margin },
            head: [],
            body: bodyData,
            theme: 'grid',
            styles: {
              font: 'helvetica',
              fontSize: 8,
              cellPadding: 1.5,
              overflow: 'linebreak',
              lineColor: [220, 220, 220],
              lineWidth: 0.1,
            },
            columnStyles: {
              0: { fontStyle: 'bold', cellWidth: 40, fillColor: [252, 252, 252], textColor: 60 },
              1: { cellWidth: 'auto', textColor: 20 }
            },
            didDrawPage: (data) => {
               yPosition = data.cursor.y;
            }
          });
          
          yPosition = doc.lastAutoTable.finalY + 8;
        } else {
          yPosition += 5;
        }
      } else {
        yPosition += 5;
      }
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
    }

    doc.save(filename);
  } catch (error) {
    console.error(error);
    alert('PDF generation failed');
  }
};

export const generateSingleSubmissionPDF = (submission, filename = 'submission.pdf') => {
  generateSubmissionsPDF([submission], 'Submission Details', filename);
};
