from services.llm_client import CerebrasClient
import sys

def test_paper_generation():
    print("Testing LLaMA 3.3-70b for Technical Paper Generation...")
    client = CerebrasClient()
    
    prompt = (
        "Write a technical abstract for a research paper titled 'Optimizing Neural Networks for Edge Devices'. "
        "The abstract should be professional, academic, and approximately 100 words."
    )
    
    print(f"\nPrompt: {prompt}\n")
    
    try:
        res = client._call_model(prompt, max_tokens=300)
        content = res.get('text', '')
        
        if content and len(content) > 20:
            print("✅ SUCCESS: Model generated content.")
            print("-" * 40)
            print(content)
            print("-" * 40)
        else:
            print("❌ FAILURE: Model returned empty or invalid content.")
            print(f"Response: {res}")
            
    except Exception as e:
        print(f"❌ PENDING: Error occurred: {e}")

if __name__ == "__main__":
    test_paper_generation()
