from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, List

app = FastAPI(title="API Layer – FastAPI", version="1.0")


class Item(BaseModel):
    id: int
    name: str
    description: str = Field(default="", max_length=250)
    tags: List[str] = Field(default_factory=list)


_store: Dict[int, Item] = {
    1: Item(id=1, name="addition", description="Performs addition of two numbers", tags=["math"]),
    2: Item(id=2, name="multiply", description="Multiplies a set of numbers", tags=["math"]),
}


@app.get("/health", summary="Basic health check")
async def health() -> Dict[str, str]:
    return {"status": "ok", "layer": "fastapi"}


@app.get("/items", response_model=List[Item], summary="List available operations")
async def list_items() -> List[Item]:
    return list(_store.values())


@app.get("/items/{item_id}", response_model=Item, summary="Get a single operation description")
async def get_item(item_id: int) -> Item:
    item = _store.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.post("/items", response_model=Item, status_code=201, summary="Register a new operation")
async def create_item(item: Item) -> Item:
    if item.id in _store:
        raise HTTPException(status_code=409, detail="Item already exists")
    _store[item.id] = item
    return item


@app.delete("/items/{item_id}", status_code=204, summary="Archive an operation")
async def delete_item(item_id: int) -> None:
    if item_id not in _store:
        raise HTTPException(status_code=404, detail="Item not found")
    del _store[item_id]
