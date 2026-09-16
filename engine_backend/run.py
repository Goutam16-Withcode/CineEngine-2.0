import uvicorn
import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

if __name__ == "__main__":
    print("🚀 Starting Movie Recommendation Engine on http://127.0.0.1:8000 ...")
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
