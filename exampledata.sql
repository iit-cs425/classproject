-- Add hand-generated example data to the database.

-- Note: because the primary keys are set as auto-increment, things will sometimes fail
-- when adding a row with a primary key of 0 - the value stored will actually be an int
-- as if the value was not specified at all.  Boo!
USE cs425;

INSERT INTO Address
(ContactName, CompanyName, District, Province_State, Nation, PostalCode, City, AddressID)
VALUES
('Mysterious sysadmin',NULL,       NULL,        'IL',            'USA',       '60616',    'Chicago',       1),
('John Smith',         NULL,       NULL,        'Illinois',      'USA',       '60634',    'Chicago',       2),
('John Doe',           'Widgetco','District 11','Washington',    'USA',       '98501',    'Olympia',       3),
('Bob',                'corp',     NULL,        'LA',            'USA',       '00000',    'Baton Rouge',   4),
('Paolo',              'CPL inc',  NULL,        'CA',            'USA',       '69999',    'San Fran',      5),
('Andrew',             'Sodexo',   NULL,        'OH',            'USA',       '60435',    'Columbus',      6),
('Julian',             NULL,       NULL,        'CO',            'USA',       '23456',    'Denver',        7),
('Mr. Big',            NULL,       NULL,        'Illinois',      'USA'       ,'60601'    ,'Bolingbrook',   8),
('Mr. Gross' ,         NULL,       'Urban',     'Hesse',         'Deutchland','60306'    ,'Frankfurt',     9),
('Mr. Grande',         NULL,       NULL,        'Rio de Janeiro','Brazil'    ,'20000-000','Rio de Janeiro',10);

INSERT INTO User
(Username, IsAdmin, IsEmployee, IsMerchant, PhoneNumber, EmailAddress, UserID, WarehouseID, Password)
VALUES
('root',   1, 0, 0, '1-234-567-8910', 'root@example.com',             1, NULL, '$2b$10$E3fm7Nm63gstlqY1Ebj4OuhuesikcqRZqOCIo8QHqUUb3xVqZIR9a'), -- password: insecure
('emp1',   0, 1, 0, '123456789',      'emp1@example.com',             2, NULL, '$2b$10$QCiJnWyL/emv8Y6k3l6qGOeBOWKJBQPGb3wMwqLbd0R.uMGWFLdJe'), -- password: emp1
('man1',   0, 1, 0, '123456789',      'man1@example.com',             3, NULL, '$2b$10$4qQwF7J10tLUjg6SoL1dy.Mf6mZLpDq2jtvMC6OSgulz.CGTXwcEe'), -- password: man1
('merch1', 0, 0, 1, '123456789',      'merch1@example.com',           4, NULL, '$2b$10$E3fm7Nm63gstlqY1Ebj4OuhuesikcqRZqOCIo8QHqUUb3xVqZIR9a'), -- password: insecure
('dave',   0, 0, 1, '2125551212',     'davidscheibelhut@hawk.iit.edu',5, NULL, '$2b$10$E3fm7Nm63gstlqY1Ebj4OuhuesikcqRZqOCIo8QHqUUb3xVqZIR9a'), -- password: insecure
('fred',   0, 1, 0, '411',            'root@google.com',              6, NULL, '$2b$10$E3fm7Nm63gstlqY1Ebj4OuhuesikcqRZqOCIo8QHqUUb3xVqZIR9a'); -- password: insecure

INSERT INTO UserHasAddress
(UserHasAddressID, AddressID, UserID)
VALUES
(1,1,1),
(2,2,2),
(3,3,3),
(4,4,4);

INSERT INTO Warehouse
(WarehouseID, RegionName, AddressID, ManagerID)
VALUES
(1, 'North America', 3, 3);

INSERT INTO EmpAssignedToWarehouse
(AssignmentID, WarehouseID, EmployeeID)
VALUES
(1,1,2);

INSERT INTO Product
(Name,Description,Attribute1Name,Attribute1Value,Attribute2Name,Attribute2Value,QuantityNow,QuantityLow,QuantityRefill,Price,Photograph,ProductID,WarehouseID,MerchantID)
VALUES
('Widget','a widget',      'Size','Big',  'Color','Purple',300,100,50,124.99,'/opt/classproject/photos/invalid.jpg',1,1,4),
('Widget','another widget','Size','Small','Color','Purple',299,100,50, 74.99,'/opt/classproject/photos/invalid.jpg',2,1,4);

INSERT INTO Category
(Name, CategoryID, MerchantID)
VALUES
('Watches',1,4),
('Wigwams',2,4),
('Widgets',3,4);

INSERT INTO ProductInCategory
(ProductInCategoryID, ProductID, CategoryID)
VALUES
(1,1,3),
(2,2,3);
