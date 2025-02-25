from fastapi import FastAPI


app = FastAPI(
    title= " Brain Tumor Detection",
    description="This is the tumor detection tool",
    version="0.1"
)

@app.get("/")
def root():
    return {"message": "Welcome to the Brain Tumor Detection API!"}