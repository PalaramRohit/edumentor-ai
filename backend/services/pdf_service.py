from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from io import BytesIO

def create_resume_pdf(data):
    """
    Generates a resume PDF from structured data.
    data format:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "skills": ["Python", "Flask"],
        "education": "...",
        "experience": "...",
        "projects": "..."
    }
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=50, bottomMargin=50)
    
    styles = getSampleStyleSheet()
    # Check if Header exists, if not add it, or use Heading1
    if 'Header' not in styles:
        styles.add(ParagraphStyle(name='Header', fontSize=18, leading=22, spaceAfter=6, alignment=1))
    
    if 'SubHeader' not in styles:
        styles.add(ParagraphStyle(name='SubHeader', fontSize=14, leading=16, spaceBefore=12, spaceAfter=6, textColor=colors.darkblue))
    
    # BodyText usually exists in sample sheet, let's just ensure we use it or update it if we really want custom settings
    # But usually 'BodyText' is standard. Let's just NOT add it again.
    # If we want specific settings, we can get it:
    # styles['BodyText'].fontSize = 10 
    # styles['BodyText'].leading = 14
    
    story = []

    # Header
    story.append(Paragraph(data.get('name', 'Name Not Provided'), styles['Header']))
    story.append(Paragraph(data.get('email', 'Email Not Provided'), styles["BodyText"]))
    story.append(Spacer(1, 12))

    # Skills
    if data.get('skills'):
        story.append(Paragraph("Technical Skills", styles['SubHeader']))
        skills_text = ", ".join(data['skills'])
        story.append(Paragraph(skills_text, styles['BodyText']))

    # Education
    if data.get('education'):
        story.append(Paragraph("Education", styles['SubHeader']))
        story.append(Paragraph(data['education'], styles['BodyText']))

    # Experience
    if data.get('experience'):
        story.append(Paragraph("Experience", styles['SubHeader']))
        story.append(Paragraph(data['experience'], styles['BodyText']))

    # Projects
    if data.get('projects'):
        story.append(Paragraph("Projects", styles['SubHeader']))
        story.append(Paragraph(data['projects'], styles['BodyText']))
        
    doc.build(story)
    buffer.seek(0)
    return buffer

def create_paper_pdf(data):
    """
    Generates a technical paper PDF from structured data.
    data format:
    {
        "title": "Paper Title",
        "author": "Author Name",
        "abstract": "...",
        "introduction": "...",
        "methodology": "...",
        "results": "...",
        "conclusion": "..."
    }
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=72)
    
    styles = getSampleStyleSheet()
    if 'Title' not in styles:
        styles.add(ParagraphStyle(name='Title', fontSize=24, leading=28, spaceAfter=24, alignment=1))
    
    if 'Author' not in styles:
        styles.add(ParagraphStyle(name='Author', fontSize=12, leading=14, spaceAfter=36, alignment=1))
        
    if 'Heading' not in styles:
        styles.add(ParagraphStyle(name='Heading', fontSize=14, leading=16, spaceBefore=18, spaceAfter=6, fontName='Helvetica-Bold'))
        
    if 'Abstract' not in styles:
        styles.add(ParagraphStyle(name='Abstract', fontSize=10, leading=12, leftIndent=36, rightIndent=36, spaceAfter=20, fontName='Helvetica-Oblique'))
    
    story = []

    # Title & Author
    story.append(Paragraph(data.get('title', 'Untitled Paper'), styles['Title']))
    story.append(Paragraph(f"By: {data.get('author', 'Unknown Author')}", styles['Author']))

    # Abstract
    if data.get('abstract'):
        story.append(Paragraph("<b>Abstract</b>", styles['BodyText']))
        story.append(Paragraph(data['abstract'], styles['Abstract']))

    # Introduction
    if data.get('introduction'):
        story.append(Paragraph("1. Introduction", styles['Heading']))
        story.append(Paragraph(data['introduction'], styles['BodyText']))

    # Methodology
    if data.get('methodology'):
        story.append(Paragraph("2. Methodology", styles['Heading']))
        story.append(Paragraph(data['methodology'], styles['BodyText']))
        
    # Results
    if data.get('results'):
        story.append(Paragraph("3. Results", styles['Heading']))
        story.append(Paragraph(data['results'], styles['BodyText']))

    # Conclusion
    if data.get('conclusion'):
        story.append(Paragraph("4. Conclusion", styles['Heading']))
        story.append(Paragraph(data['conclusion'], styles['BodyText']))
    
    doc.build(story)
    buffer.seek(0)
    return buffer
