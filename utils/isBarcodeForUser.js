// Move to db call or some enum
let listOfUsers = [
  "MriDevTeam",
  "e9a8ff36-e92e-43ce-891d-9bbed15a1bb8",
  "9ca0892d-c8b8-5199-86cb-29d85461c6f2",
  "b74d451e-8127-56c2-a8af-accdf199417c"
]

// returns barcode of user if it finds one
module.exports = function isBarcodeForUser(barcode) {
  return listOfUsers.find(user => user === barcode)
}