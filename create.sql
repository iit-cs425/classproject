USE cs425;

CREATE TABLE Address
(
  ContactName VARCHAR(64) NOT NULL,
  CompanyName VARCHAR(64),
  District VARCHAR(64),
  Province/State VARCHAR(64) NOT NULL,
  Nation VARCHAR(64) NOT NULL,
  PostalCode VARCHAR(16) NOT NULL,
  City VARCHAR(32) NOT NULL,
  AddressID INT NOT NULL,
  PRIMARY KEY (AddressID)
);

CREATE TABLE Warehouse
(
  WarehouseID INT NOT NULL,
  RegionName VARCHAR(32) NOT NULL,
  AddressID INT NOT NULL,
  ManagerID INT NOT NULL,
  PRIMARY KEY (WarehouseID),
  FOREIGN KEY (AddressID) REFERENCES Address(AddressID),
  FOREIGN KEY (ManagerID) REFERENCES User(UserID)
);

CREATE TABLE Product
(
  Name VARCHAR(32) NOT NULL,
  Description VARCHAR(128) NOT NULL,
  Attribute1Name VARCHAR(32),
  Attribute1Value VARCHAR(32),
  Attribute2Name VARCHAR(32),
  Attribute2Value VARCHAR(32),
  QuantityNow INT NOT NULL,
  QuantityLow INT NOT NULL,
  QuantityRefill INT NOT NULL,
  Price MONEY NOT NULL,
  Photograph VARCHAR(64),
  ProductID INT NOT NULL,
  WarehouseID INT NOT NULL,
  MerchantID INT NOT NULL,
  PRIMARY KEY (ProductID),
  FOREIGN KEY (WarehouseID) REFERENCES Warehouse(WarehouseID),
  FOREIGN KEY (MerchantID) REFERENCES User(UserID)
);

CREATE TABLE Category
(
  Name VARCHAR(32) NOT NULL,
  CategoryID INT NOT NULL,
  MerchantID INT NOT NULL,
  PRIMARY KEY (CategoryID),
  FOREIGN KEY (MerchantID) REFERENCES User(UserID)
);

CREATE TABLE User
(
  Username VARCHAR(32) NOT NULL,
  IsAdmin BIT NOT NULL,
  IsEmployee BIT NOT NULL,
  IsMerchant BIT NOT NULL,
  PasswordHash VARCHAR(64) NOT NULL,
  PhoneNumber VARCHAR(20) NOT NULL,
  EmailAddress VARCHAR(64) NOT NULL,
  UserID INT NOT NULL,
  PasswordSalt VARCHAR(64) NOT NULL,
  WarehouseID INT NOT NULL,
  PRIMARY KEY (UserID),
  FOREIGN KEY (WarehouseID) REFERENCES Warehouse(WarehouseID),
  UNIQUE (Username)
);

CREATE TABLE EmpAssignedToWarehouse
(
  AssignmentID INT NOT NULL,
  WarehouseID INT NOT NULL,
  EmployeeID INT NOT NULL,
  PRIMARY KEY (AssignmentID),
  FOREIGN KEY (WarehouseID) REFERENCES Warehouse(WarehouseID),
  FOREIGN KEY (EmployeeID) REFERENCES User(UserID)
);

CREATE TABLE ProductInCategory
(
  ProductInCategoryID INT NOT NULL,
  ProductID INT NOT NULL,
  CategoryID INT NOT NULL,
  PRIMARY KEY (ProductInCategoryID),
  FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
  FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);

CREATE TABLE UserHasAddress
(
  UserHasAddressID INT NOT NULL,
  AddressID INT NOT NULL,
  UserID INT NOT NULL,
  PRIMARY KEY (UserHasAddressID),
  FOREIGN KEY (AddressID) REFERENCES Address(AddressID),
  FOREIGN KEY (UserID) REFERENCES User(UserID)
);
