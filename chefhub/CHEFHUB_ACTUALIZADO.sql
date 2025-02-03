CREATE DATABASE chefhub_db;
USE chefhub_db;

-- Tabla imagen
CREATE TABLE imagen (
    id_imagen INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    ruta VARCHAR(255) NOT NULL,
    baja INT DEFAULT 0 
);

-- Tabla usuario
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    clave VARCHAR(255) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(15),
    fecha_creacion DATETIME NOT NULL DEFAULT NOW(),
    fecha_modif DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    baja INT DEFAULT 0 
);

-- Tabla personalizacion
CREATE TABLE personalizacion (
    nombre_rest VARCHAR(50) PRIMARY KEY,
    direccion VARCHAR(255) NOT NULL,
    zona_horaria VARCHAR(50) NOT NULL,
    moneda VARCHAR(10) NOT NULL,
    baja INT DEFAULT 0 
);

-- Tabla telefono
CREATE TABLE telefono (
    id_telefono INT PRIMARY KEY AUTO_INCREMENT,
    telefono VARCHAR(15) NOT NULL,
    nombre_rest VARCHAR(50) NOT NULL,
    FOREIGN KEY (nombre_rest) REFERENCES personalizacion(nombre_rest),
    baja INT DEFAULT 0 
);

-- Tabla funcionario
CREATE TABLE funcionario (
    id_usuario INT NOT NULL,
    ci VARCHAR(11) PRIMARY KEY,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    horario_entrada TIME NOT NULL,
    horario_salida TIME NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    id_imagen INT,
    baja INT DEFAULT 0, 
    FOREIGN KEY (id_imagen) REFERENCES imagen(id_imagen),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla cliente
CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    baja INT DEFAULT 0 
);

-- Tabla token
CREATE TABLE token (
    id_token INT AUTO_INCREMENT PRIMARY KEY,
    email varchar(50) NOT NULL,
    token VARCHAR (6) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT NOW(),
    baja INT DEFAULT 0 
);

-- Tabla direccion
CREATE TABLE direccion (
	id_usuario INT not null,
    id_direccion INT PRIMARY KEY AUTO_INCREMENT,
    calle VARCHAR(255) NOT NULL,
    apto VARCHAR(20) NOT NULL,
    n_puerta INT NOT NULL,
    referencia VARCHAR(255),
    baja INT DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla factura
CREATE TABLE factura (
    id_factura INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    iva DECIMAL(5, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    baja INT DEFAULT 0 
);

-- Tabla pago
CREATE TABLE pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    id_factura INT NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES factura(id_factura),
    baja INT DEFAULT 0 
);

-- Tabla preferencia
CREATE TABLE preferencia (
    id_preferencia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    alimentaria BOOLEAN NOT NULL,
    dietetica BOOLEAN NOT NULL,
    id_categoria INT NOT NULL,
    CONSTRAINT chk_alimentaria_dietetica CHECK (alimentaria != dietetica),
    baja INT DEFAULT 0 
);

-- Tabla producto
CREATE TABLE producto (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    imagen text,
    baja INT DEFAULT 0 
);

-- Tabla categoria_producto
CREATE TABLE categoria_producto (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    id_categoria_padre INT,
    imagen text,
    baja INT DEFAULT 0 
);
-- Tabla mesa
CREATE TABLE mesa (
    id_mesa INT PRIMARY KEY AUTO_INCREMENT,
    capacidad INT NOT NULL,
    baja INT DEFAULT 0 
);

-- Tabla pedido
CREATE TABLE pedido (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    subtotal DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    id_cliente INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    comentario TEXT,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    id_direccion INT NULL,
    id_factura INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_direccion) REFERENCES direccion(id_direccion),
    FOREIGN KEY (id_factura) REFERENCES factura(id_factura),
    CHECK (categoria != 'Delivery' OR id_direccion IS NOT NULL),
    baja INT DEFAULT 0 
);

-- Tabla dia_horario
CREATE TABLE dia_horario (
    dia_semana VARCHAR(10) PRIMARY KEY,
    horario_apertura TIME NOT NULL,
    horario_cierre TIME NOT NULL,
    baja INT DEFAULT 0 
);

-- Tabla excepcion_horario
CREATE TABLE excepcion_horario (
    fecha DATE PRIMARY KEY,
    horario_apertura TIME NOT NULL,
    horario_cierre TIME NOT NULL,
    baja INT DEFAULT 0 
);

-- Relaciones entre tablas
CREATE TABLE cliente_preferencia (
    id_cliente INT NOT NULL,
    id_preferencia INT NOT NULL,
    PRIMARY KEY (id_cliente, id_preferencia),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_preferencia) REFERENCES preferencia(id_preferencia),
    baja INT DEFAULT 0 
);

CREATE TABLE cliente_mesa (
    id_cliente INT NOT NULL,
    id_mesa INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    cant_personas INT NOT NULL,
    nombre_reserva varchar(20)  not null,
    tel_contacto INT not null,
    estado VARCHAR(20) DEFAULT 'En proceso',
    PRIMARY KEY (id_cliente, id_mesa, fecha, hora),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_mesa) REFERENCES mesa(id_mesa),
    baja INT DEFAULT 0 
);

CREATE TABLE mesa_pedido (
    id_pedido INT NOT NULL,
    id_mesa INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME,
    ci VARCHAR(11) NOT NULL,
    PRIMARY KEY (id_pedido, id_mesa),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_mesa) REFERENCES mesa(id_mesa),
    FOREIGN KEY (ci) REFERENCES funcionario(ci),
    baja INT DEFAULT 0 
);

CREATE TABLE pedido_producto (
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    importe DECIMAL(10, 2) NOT NULL,
    nota TEXT,
    ci VARCHAR(11) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_pedido, id_producto),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (ci) REFERENCES funcionario(ci),
    baja INT DEFAULT 0 
);

CREATE TABLE producto_categoria (
    id_producto INT NOT NULL,
    id_categoria INT NOT NULL,
    PRIMARY KEY (id_producto, id_categoria),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_categoria) REFERENCES categoria_producto(id_categoria),
    baja INT DEFAULT 0 
);

-- Índices recomendados
CREATE INDEX idx_cliente ON cliente(id_cliente);
CREATE INDEX idx_pedido ON pedido(id_pedido);
CREATE INDEX idx_fecha_hora_pedido ON pedido(fecha, hora);
CREATE INDEX idx_mesa ON mesa(id_mesa);

-- Auditoría
CREATE TABLE pedido_auditoria (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    fecha_modificacion DATETIME NOT NULL DEFAULT NOW(),
    estado_anterior VARCHAR(50) NOT NULL,
    estado_nuevo VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    baja INT DEFAULT 0 
);

CREATE TABLE factura_auditoria (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_factura INT NOT NULL,
    fecha_modificacion DATETIME NOT NULL DEFAULT NOW(),
    estado_anterior VARCHAR(50) NOT NULL,
    estado_nuevo VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES factura(id_factura),
    baja INT DEFAULT 0 
);

CREATE TABLE pago_auditoria (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_pago INT NOT NULL,
    fecha_modificacion DATETIME NOT NULL DEFAULT NOW(),
    monto_anterior DECIMAL(10, 2) NOT NULL,
    monto_nuevo DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_pago) REFERENCES pago(id_pago),
    baja INT DEFAULT 0 
);

CREATE TABLE ingrediente (
    id_ingrediente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    extra BOOLEAN NOT NULL DEFAULT false,
    baja INT DEFAULT 0 
);

CREATE TABLE producto_ingrediente (
    id_producto INT NOT NULL,
    id_ingrediente INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    extra BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (id_producto, id_ingrediente),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_ingrediente) REFERENCES ingrediente(id_ingrediente),
    baja INT DEFAULT 0 
);



  -- Insertar datos en la tabla imagen
INSERT INTO imagen (tipo, ruta) VALUES
('Foto', 'imagen1.jpg'),
('Foto', 'imagen2.jpg'),
('Foto', 'imagen3.jpg'),
('Foto', 'imagen4.jpg'),
('Foto', 'imagen5.jpg');

-- Insertar datos en la tabla usuario
INSERT INTO usuario (email, clave, nombre, apellido, telefono) VALUES
('juan@example.com', 'clave123', 'Juan', 'Perez', '123456789'),
('maria@example.com', 'clave456', 'Maria', 'Lopez', '987654321'),
('carlos@example.com', 'clave789', 'Carlos', 'Gomez', '112233445'),
('ana@example.com', 'clave101', 'Ana', 'Torres', '556677889'),
('luis@example.com', 'clave202', 'Luis', 'Fernandez', '998877665'),
('jorge@example.com', 'clave303', 'Jorge', 'Mendez', '223344556'),
('patricia@example.com', 'clave404', 'Patricia', 'Morales', '667788990'),
('victor@example.com', 'clave505', 'Victor', 'Sanchez', '778899112'),
('sofia@example.com', 'clave606', 'Sofia', 'Martinez', '334455667'),
('pedro@example.com', 'clave707', 'Pedro', 'Perez', '445566778');

-- Insertar datos en la tabla personalizacion
INSERT INTO personalizacion (nombre_rest, direccion, zona_horaria, moneda) VALUES
('Restaurante A', 'Calle 123, Ciudad', 'UTC-3', 'USD'),
('Restaurante B', 'Avenida 456, Ciudad', 'UTC-3', 'EUR'),
('Restaurante C', 'Calle 789, Ciudad', 'UTC-3', 'USD'),
('Restaurante D', 'Avenida 101, Ciudad', 'UTC-3', 'EUR'),
('Restaurante E', 'Calle 202, Ciudad', 'UTC-3', 'USD');

-- Insertar datos en la tabla telefono
INSERT INTO telefono (telefono, nombre_rest) VALUES
('123456789', 'Restaurante A'),
('987654321', 'Restaurante B'),
('112233445', 'Restaurante C'),
('556677889', 'Restaurante D'),
('998877665', 'Restaurante E');

-- Insertar datos en la tabla funcionario
INSERT INTO funcionario ( id_usuario, ci, fecha_nacimiento, direccion, horario_entrada, horario_salida, cargo, id_imagen) VALUES
('6','11111111111', '1985-05-10', 'Calle 1', '08:00:00', '16:00:00', 'Chef', 1),
('7','22222222222', '1990-07-15', 'Calle 2', '09:00:00', '17:00:00', 'Mesero', 2),
('8','33333333333', '1987-09-25', 'Calle 3', '10:00:00', '18:00:00', 'Administrativo', 3),
('9','44444444444', '1992-12-05', 'Calle 4', '11:00:00', '19:00:00', 'Chef', 4),
('10','55555555555', '1980-02-20', 'Calle 5', '07:00:00', '15:00:00', 'Mesero', 5);

-- Insertar datos en la tabla cliente
INSERT INTO cliente (id_usuario) VALUES
(1), (2), (3), (4), (5);

-- Insertar datos en la tabla direccion
INSERT INTO direccion (id_usuario,calle, apto, n_puerta, referencia) VALUES
(5,'Calle A', '101', 101, 'Frente a la plaza'),
(4,'Calle B', '222', 202, 'Al lado del supermercado'),
(3,'Calle C', '333', 303, 'Cerca del parque'),
(2,'Calle D', '444', 404, 'Junto a la iglesia'),
(1,'Calle E', '555', 505, 'Frente al estadio');

-- Insertar datos en la tabla factura
INSERT INTO factura (fecha, hora, total, iva, estado) VALUES
('2025-01-01', '12:00:00', 50.00, 10.00, 'Pagada'),
('2025-01-02', '14:30:00', 80.00, 16.00, 'Pendiente'),
('2025-01-03', '15:00:00', 100.00, 20.00, 'Pagada'),
('2025-01-04', '16:45:00', 120.00, 24.00, 'Pendiente'),
('2025-01-05', '18:00:00', 60.00, 12.00, 'Pagada');


-- Insertar datos en la tabla preferencia (corregido para no violar el check constraint)
INSERT INTO preferencia (nombre, alimentaria, dietetica, id_categoria) VALUES
('Vegetariana', true, false, 1),
('Sin gluten', true, false, 2),  -- Cambio: alimentaria true, dietetica false
('Sin lactosa', true, false, 3),  -- Cambio: alimentaria true, dietetica false
('Vegana', true, false, 4),
('Carnívora', false, true, 5);


-- Insertar datos en la tabla producto
INSERT INTO producto (nombre, precio, descripcion,imagen) VALUES
('Hamburguesa', 10.00, 'Deliciosa hamburguesa de carne','image-example.jpg'),
('Pizza', 15.00, 'Pizza con ingredientes frescos','image-example.jpg'),
('Ensalada', 8.00, 'Ensalada fresca con aderezo especial','image-example.jpg'),
('Pasta', 12.00, 'Pasta al estilo italiano','image-example.jpg'),
('Sopa', 7.00, 'Sopa casera con vegetales','image-example.jpg');

-- Insertar datos en la tabla categoria_producto
INSERT INTO categoria_producto (nombre, descripcion, id_categoria_padre, imagen) VALUES
('Hamburguesas', '', NULL, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFtYnVyZ2VyfGVufDB8fDB8fHww'),
('Helado', '', NULL, 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Pizza', '', NULL, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Entradas', 'Entradas y aperitivos', NULL ,''),
('Comida Rápida', 'Comidas rápidas para llevar', NULL, '');

-- Insertar datos en la tabla mesa
INSERT INTO mesa (capacidad) VALUES
(4),
(2),
(6),
(8),
(10);

-- Insertar datos en la tabla pedido
INSERT INTO pedido (subtotal, estado, categoria, id_cliente, fecha, hora, comentario, calificacion, id_direccion, id_factura) VALUES
(50.00, 'Pendiente', 'Delivery', 1, '2025-01-01', '12:00:00', 'Ninguno', 5, 1, 1),
(80.00, 'Pendiente', 'Mesa', 2, '2025-01-02', '14:30:00', 'Ninguno', 4, 2, 2),
(100.00, 'Pagada', 'Delivery', 3, '2025-01-03', '15:00:00', 'Pedido grande', 3, 3, 3),
(120.00, 'Pendiente', 'Mesa', 4, '2025-01-04', '16:45:00', 'Ninguno', 2, 4, 4),
(60.00, 'Pagada', 'Delivery', 5, '2025-01-05', '18:00:00', 'Sin comentarios', 5, 5, 5);
-- TEST DE RESERVAS
INSERT INTO cliente_mesa (id_cliente, id_mesa, fecha, hora, cant_personas, nombre_reserva, tel_contacto, estado) VALUES
(1, 1, '2025-02-01', '10:00:00', 4, 'Carlos Pérez', 123456789, 'Reservada'),
(1, 1, '2025-02-02', '12:00:00', 4, 'Ana Gómez', 987654321, 'Reservada'),
(1, 1, '2025-02-05', '14:00:00', 4, 'Luis Fernández', 112233445, 'Reservada'),
(1, 1, '2025-02-10', '16:00:00', 4, 'Marta López', 556677889, 'Reservada'),
(1, 1, '2025-02-15', '18:00:00', 4, 'Jorge Ramírez', 223344556, 'Reservada'),

(2, 2, '2025-02-01', '11:00:00', 2, 'Sofía Méndez', 334455667, 'Reservada'),
(2, 2, '2025-02-02', '13:00:00', 2, 'Ricardo Díaz', 778899001, 'Reservada'),
(2, 2, '2025-02-05', '15:00:00', 2, 'Elena Castillo', 998877665, 'Reservada'),
(2, 2, '2025-02-10', '17:00:00', 2, 'Fernando Torres', 665544332, 'Reservada'),
(2, 2, '2025-02-15', '19:00:00', 2, 'Patricia Ruiz', 554433221, 'Reservada'),

(3, 3, '2025-02-01', '12:00:00', 6, 'Gabriel Herrera', 111222333, 'Reservada'),
(3, 3, '2025-02-02', '14:00:00', 6, 'Andrea Vargas', 444555666, 'Reservada'),
(3, 3, '2025-02-05', '16:00:00', 6, 'Pedro Navarro', 777888999, 'Reservada'),
(3, 3, '2025-02-10', '18:00:00', 6, 'Laura Morales', 666777888, 'Reservada'),
(3, 3, '2025-02-15', '20:00:00', 6, 'Esteban Silva', 999000111, 'Reservada'),

(4, 4, '2025-02-01', '13:00:00', 3, 'Natalia Ortega', 123123123, 'Reservada'),
(4, 4, '2025-02-02', '15:00:00', 3, 'Daniel Fuentes', 321321321, 'Reservada'),
(4, 4, '2025-02-05', '17:00:00', 3, 'Silvia Rojas', 456456456, 'Reservada'),
(4, 4, '2025-02-10', '19:00:00', 3, 'Mario Estrada', 654654654, 'Reservada'),
(4, 4, '2025-02-15', '21:00:00', 3, 'Paula Benítez', 789789789, 'Reservada'),

(5, 5, '2025-02-01', '14:00:00', 5, 'Oscar Medina', 987987987, 'Reservada'),
(5, 5, '2025-02-02', '16:00:00', 5, 'Camila Reyes', 654987321, 'Reservada'),
(5, 5, '2025-02-05', '18:00:00', 5, 'Rodrigo Alonso', 741852963, 'Reservada'),
(5, 5, '2025-02-10', '20:00:00', 5, 'Vanessa Sánchez', 369258147, 'Reservada'),
(5, 5, '2025-02-15', '22:00:00', 5, 'Ismael Correa', 852963741, 'Reservada');


INSERT INTO mesa_pedido (id_pedido, id_mesa, fecha, hora_inicio, hora_fin, ci) VALUES
(1, 1, '2025-01-28', '12:00:00', '14:00:00', '22222222222'),
(2, 2, '2025-01-28', '13:00:00', '14:30:00', '22222222222'),
(3, 3, '2025-01-28', '14:00:00', '15:00:00', '22222222222'),
(4, 4, '2025-01-28', '15:00:00', '16:00:00', '22222222222'),
(5, 5, '2025-01-28', '16:00:00', '17:00:00', '22222222222');

INSERT INTO pedido_producto (id_pedido, id_producto, cantidad, importe, nota, ci, estado) VALUES
(1, 1, 2, 20.00, 'Sin salsa', '22222222222', 'En proceso'),
(2, 2, 1, 15.00, 'Con extra queso', '22222222222', 'En proceso'),
(3, 3, 3, 30.00, 'Con ensalada', '22222222222', 'En proceso'),
(4, 4, 4, 40.00, 'Con bebida', '22222222222', 'En proceso'),
(5, 5, 5, 50.00, 'Con postre', '22222222222', 'En proceso');

INSERT INTO producto_categoria (id_producto, id_categoria) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO ingrediente (nombre, precio, stock, extra) VALUES
('Queso', 2.00, 50, true),    -- Ingrediente extra
('Tomate', 0.50, 100, false), -- No extra
('Lechuga', 0.30, 80, false), -- No extra
('Bacon', 3.00, 30, true),    -- Ingrediente extra
('Salsa especial', 1.00, 20, true), -- Ingrediente extra
('Pechuga de pollo', 3.50, 40, true), -- Ingrediente extra
('Pepperoni', 2.50, 60, true), -- Ingrediente extra
('Mushrooms', 1.80, 70, true), -- Ingrediente extra
('Aceitunas', 1.20, 90, false), -- No extra
('Cebolla', 0.70, 100, false); -- No extra

-- Hamburguesa
INSERT INTO producto_ingrediente (id_producto, id_ingrediente, cantidad, extra) 
VALUES (1, 1, 1, true),  -- Hamburguesa con queso (extra)
       (1, 2, 2, false), -- Hamburguesa con tomate
       (1, 3, 1, false), -- Hamburguesa con lechuga
       (1, 4, 1, true),  -- Hamburguesa con bacon (extra)
       (1, 5, 1, false), -- Hamburguesa con salsa especial
       (1, 7, 1, false), -- Hamburguesa con pepperoni
       (1, 9, 1, true),  -- Hamburguesa con aceitunas (extra)
       (1, 10, 1, false);-- Hamburguesa con cebolla

-- Pizza
INSERT INTO producto_ingrediente (id_producto, id_ingrediente, cantidad, extra) 
VALUES (2, 1, 1, true),  -- Pizza con queso (extra)
       (2, 2, 2, false), -- Pizza con tomate
       (2, 3, 1, false), -- Pizza con lechuga
       (2, 4, 1, true),  -- Pizza con bacon (extra)
       (2, 5, 1, false), -- Pizza con salsa especial
       (2, 7, 1, true),  -- Pizza con pepperoni (extra)
       (2, 9, 1, false), -- Pizza con aceitunas
       (2, 10, 1, false);-- Pizza con cebolla

-- Ensalada
INSERT INTO producto_ingrediente (id_producto, id_ingrediente, cantidad, extra) 
VALUES (3, 1, 1, false), -- Ensalada con queso
       (3, 2, 1, false), -- Ensalada con tomate
       (3, 3, 2, true),  -- Ensalada con lechuga (extra)
       (3, 4, 1, false), -- Ensalada con bacon
       (3, 5, 1, false), -- Ensalada con salsa especial
       (3, 7, 1, false), -- Ensalada con pepperoni
       (3, 9, 1, false), -- Ensalada con aceitunas
       (3, 10, 1, true); -- Ensalada con cebolla (extra)

-- Pasta
INSERT INTO producto_ingrediente (id_producto, id_ingrediente, cantidad, extra) 
VALUES (4, 1, 1, false), -- Pasta con queso
       (4, 2, 1, false), -- Pasta con tomate
       (4, 3, 1, false), -- Pasta con lechuga
       (4, 4, 1, false), -- Pasta con bacon
       (4, 5, 1, true),  -- Pasta con salsa especial (extra)
       (4, 7, 1, false), -- Pasta con pepperoni
       (4, 9, 1, false), -- Pasta con aceitunas
       (4, 10, 1, false);-- Pasta con cebolla

-- Sopa
INSERT INTO producto_ingrediente (id_producto, id_ingrediente, cantidad, extra) 
VALUES (5, 1, 1, false), -- Sopa con queso
       (5, 2, 1, false), -- Sopa con tomate
       (5, 3, 1, false), -- Sopa con lechuga
       (5, 4, 1, false), -- Sopa con bacon
       (5, 5, 1, false), -- Sopa con salsa especial
       (5, 7, 1, false), -- Sopa con pepperoni
       (5, 9, 1, true),  -- Sopa con aceitunas (extra)
       (5, 10, 1, false);-- Sopa con cebolla






