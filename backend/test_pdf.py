from services.pdf_service import create_resume_pdf
import sys

try:
    data = {
        "name": "Test User",
        "email": "test@example.com",
        "skills": ["Python", "Debugging"],
        "education": "Self Taught",
        "experience": "Testing",
        "projects": "Fixing Bugs"
    }
    print("Attempting to generate PDF...")
    pdf = create_resume_pdf(data)
    print("PDF Generated successfully.")
    with open("test_resume.pdf", "wb") as f:
        f.write(pdf.read())
    print("Saved to test_resume.pdf")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
