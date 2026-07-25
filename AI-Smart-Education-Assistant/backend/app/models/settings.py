from pydantic import BaseModel, Field

class SettingsBase(BaseModel):
    user_id: str
    # preferences etc.

class SettingsInDB(SettingsBase):
    id: str = Field(alias='_id')
    class Config:
        populate_by_name = True

