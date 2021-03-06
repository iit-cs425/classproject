DROP DATABASE IF EXISTS cs425;
CREATE DATABASE cs425;
USE cs425;

CREATE TABLE Address
(
  ContactName VARCHAR(64) NOT NULL,
  CompanyName VARCHAR(64),
  District VARCHAR(64),
  Province_State VARCHAR(64) NOT NULL,
  Nation VARCHAR(64) NOT NULL,
  PostalCode VARCHAR(16) NOT NULL,
  City VARCHAR(32) NOT NULL,
  AddressID INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (AddressID)
);
ALTER TABLE Address AUTO_INCREMENT=1;

CREATE TABLE Warehouse
(
  WarehouseID INT NOT NULL AUTO_INCREMENT,
  RegionName VARCHAR(32) NOT NULL,
  AddressID INT NOT NULL,
  ManagerID INT NOT NULL,
  PRIMARY KEY (WarehouseID),
  FOREIGN KEY (AddressID) REFERENCES Address(AddressID)
);
ALTER TABLE Warehouse AUTO_INCREMENT=1;

CREATE TABLE User
(
  Username VARCHAR(32) NOT NULL,
  IsAdmin BIT NOT NULL,
  IsEmployee BIT NOT NULL,
  IsMerchant BIT NOT NULL,
  Password VARCHAR(64) NOT NULL,
  PhoneNumber VARCHAR(20) NOT NULL,
  EmailAddress VARCHAR(64) NOT NULL,
  UserID INT NOT NULL AUTO_INCREMENT,
  WarehouseID INT,
  PRIMARY KEY (UserID),
  FOREIGN KEY (WarehouseID) REFERENCES Warehouse(WarehouseID),
  UNIQUE (Username)
);
ALTER TABLE User AUTO_INCREMENT=1;
-- now that we've defined User, we can add the Warehouse->User fkey
ALTER TABLE Warehouse
ADD FOREIGN KEY (ManagerID) REFERENCES User(UserID);


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
  Price DECIMAL(10,2) NOT NULL,
  Photograph VARCHAR(64),
  ProductID INT NOT NULL AUTO_INCREMENT,
  WarehouseID INT NOT NULL,
  MerchantID INT NOT NULL,
  PRIMARY KEY (ProductID),
  FOREIGN KEY (WarehouseID) REFERENCES Warehouse(WarehouseID),
  FOREIGN KEY (MerchantID) REFERENCES User(UserID)
);
ALTER TABLE Product AUTO_INCREMENT=1;

CREATE TABLE Category
(
  Name VARCHAR(32) NOT NULL,
  CategoryID INT NOT NULL AUTO_INCREMENT,
  MerchantID INT NOT NULL,
  PRIMARY KEY (CategoryID),
  FOREIGN KEY (MerchantID) REFERENCES User(UserID)
);
ALTER TABLE Category AUTO_INCREMENT=1;

CREATE TABLE EmpAssignedToWarehouse
(
  AssignmentID INT NOT NULL AUTO_INCREMENT,
  WarehouseID INT NOT NULL,
  EmployeeID INT NOT NULL,
  PRIMARY KEY (AssignmentID),
  FOREIGN KEY (WarehouseID) REFERENCES Warehouse(WarehouseID),
  FOREIGN KEY (EmployeeID) REFERENCES User(UserID)
);
ALTER TABLE EmpAssignedToWarehouse AUTO_INCREMENT=1;

CREATE TABLE ProductInCategory
(
  ProductInCategoryID INT NOT NULL AUTO_INCREMENT,
  ProductID INT NOT NULL,
  CategoryID INT NOT NULL,
  PRIMARY KEY (ProductInCategoryID),
  FOREIGN KEY (ProductID) REFERENCES Product(ProductID),
  FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
);
ALTER TABLE ProductInCategory AUTO_INCREMENT=1;

CREATE TABLE UserHasAddress
(
  UserHasAddressID INT NOT NULL AUTO_INCREMENT,
  AddressID INT NOT NULL,
  UserID INT NOT NULL,
  PRIMARY KEY (UserHasAddressID),
  FOREIGN KEY (AddressID) REFERENCES Address(AddressID),
  FOREIGN KEY (UserID) REFERENCES User(UserID)
);
ALTER TABLE UserHasAddress AUTO_INCREMENT=1;
