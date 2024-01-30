---@class nearestPlayer
---@field id string | number
---@field name string | number
---@field distance number

---@class ActiveReport
---@field id number | string
---@field playerName string
---@field type "Bug" | "Question" | "Gameplay"
---@field description string
---@field timedate string
---@field title string
---@field nearestPlayers nearestPlayer[]
---@field messages message[]
---@field reportId string

---@class OnlineStaff
---@field id number | string
---@field license string

---@class PlayerData
---@field name string
---@field identifiers table
---@field isStaff boolean

---@class message
---@field data string
---@field timedate string

---@class FetchData
---@field webhook string
---@field embed EmbedData

---@class EmbedData
---@field title string
---@field description string
---@field color string | number
---@field fields FetchFields[]
---@field footer? {}
---@field timestamp? osdate | string

---@class FetchFields
---@field name string
---@field value? string
---@field inline? boolean
