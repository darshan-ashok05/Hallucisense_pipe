# test_requests_raw.py (updated)
import requests

HEADERS = {"User-Agent": "HalluciSense-StudentProject/1.0 (student research project)"}

url = "https://en.wikipedia.org/w/api.php"
params = {
    "action": "query",
    "list": "search",
    "srsearch": "Eiffel Tower",
    "format": "json",
    "srlimit": 3
}

resp = requests.get(url, params=params, headers=HEADERS, timeout=10)
print(f"Status code: {resp.status_code}")
print(f"Response: {resp.text[:500]}")