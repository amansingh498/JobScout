import httpx
from bs4 import BeautifulSoup
from typing import Optional

class WebReaderTool:
    async def read_page(self, url: str) -> Optional[str]:
        """Fetch and extract clean text from a web page."""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            async with httpx.AsyncClient(headers=headers, timeout=10.0, follow_redirects=True) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")
                    # Remove scripts, styles, and headers/footers
                    for tag in soup(["script", "style", "nav", "footer", "header"]):
                        tag.decompose()
                    text = soup.get_text(separator=" ", strip=True)
                    return text[:4000] # Return clean snippet
        except Exception as e:
            print(f"Failed to read page {url}: {e}")
        return None
