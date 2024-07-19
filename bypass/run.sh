Xvfb :99 -screen 0 640x480x8 -nolisten tcp &
uvicorn app.run:app --host 0.0.0.0 --port 8000
