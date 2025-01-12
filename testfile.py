from fpdf import FPDF

class UPSChubPDF(FPDF):
    def header(self):
        self.set_font("Arial", style="B", size=14)
        self.cell(0, 10, "UPSChub - Exam Questions Table", align="C", ln=True)
        self.ln(10)
    
    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", size=8)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

def generate_exam_pdf(data, output_path):
    pdf = UPSChubPDF()
    pdf.add_page()
    
    # Add Table Header
    pdf.set_font("Arial", style="B", size=12)
    pdf.cell(20, 10, "Sl. No", 1, 0, "C")
    pdf.cell(100, 10, "Test Details", 1, 0, "C")
    pdf.cell(40, 10, "Link", 1, 0, "C")
    pdf.cell(30, 10, "View PDF", 1, 1, "C")
    
    # Add Table Rows
    pdf.set_font("Arial", size=12)
    for i, row in enumerate(data, start=1):
        pdf.cell(20, 10, str(i), 1, 0, "C")
        pdf.cell(100, 10, row['test_details'], 1, 0, "L")
        pdf.cell(40, 10, row['link'], 1, 0, "L")
        pdf.cell(30, 10, "View PDF", 1, 1, "C")
    
    # Save PDF
    pdf.output(output_path)

# Example data for the table
exam_data = [
    {"test_details": "General Studies Test 1", "link": "http://upsclub.com/test1"},
    {"test_details": "CSAT Test 2", "link": "http://upsclub.com/test2"},
    {"test_details": "Essay Writing Test 3", "link": "http://upsclub.com/test3"},
]

# Output path for the PDF
output_path = "UPSChub_Exam_Questions.pdf"
generate_exam_pdf(exam_data, output_path)
print(f"PDF created: {output_path}")
