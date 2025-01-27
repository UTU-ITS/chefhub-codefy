create database chefhub_db;
use chefhub_db;
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    teléfono VARCHAR(15) NOT NULL UNIQUE,
    fecha_creación DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_modif DATETIME NULL
);

CREATE TABLE rol_usuario (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripción TEXT NULL
);

CREATE TABLE permiso (
    id_permiso INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripción TEXT NULL
);



CREATE TABLE cargo_empleado (
    id_cargo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripción TEXT NULL
);

CREATE TABLE imagen (
    id_imagen INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    ruta VARCHAR(255) NOT NULL
);



CREATE TABLE empleado (
    ci VARCHAR(20) PRIMARY KEY,
    id_usuario INT,
    id_cargo INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    clave VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fecha_contratación DATE NOT NULL,
    dirección TEXT NULL,
    salario DECIMAL(10,2) NOT NULL,
    horario_entrada TIME NOT NULL,
    horario_salida TIME NOT NULL,
    id_imagen INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_cargo) REFERENCES cargo_empleado(id_cargo),
    FOREIGN KEY (id_imagen) REFERENCES imagen(id_imagen)
);

CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE comentario (
    id_comentario INT PRIMARY KEY AUTO_INCREMENT,
    contenido TEXT NOT NULL,
    calificación INT NOT NULL CHECK (calificación BETWEEN 1 AND 5),
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_cliente INT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE preferencia_alimentaria (
    id_preferencia INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripción TEXT NULL
);

CREATE TABLE restricciones_dieteticas (
    id_restricción INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripción TEXT NULL
);

CREATE TABLE categoría_pedido (
    id_categoría INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripción TEXT NULL
);


CREATE TABLE pedido (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    subtotal DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    id_cliente INT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    id_categoría INT,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_categoría) REFERENCES categoría_pedido(id_categoría)
);

CREATE TABLE categoria_producto (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripción TEXT NULL
);



CREATE TABLE producto (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripción TEXT NULL,
    id_categoría INT,
    id_imagen INT,
    FOREIGN KEY (id_categoría) REFERENCES categoría_producto(id_categoría),
    FOREIGN KEY (id_imagen) REFERENCES imagen(id_imagen)
);
CREATE TABLE producto_categoria(
id_producto int not null,
id_categoria int not null,
FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
FOREIGN KEY (id_categoria) REFERENCES categoria_producto(id_categoria));

CREATE TABLE menú (
    id_menú INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripción TEXT NULL
);


CREATE TABLE dirección (
    id_dirección INT PRIMARY KEY AUTO_INCREMENT,
    calle VARCHAR(100) NOT NULL,
    esquina VARCHAR(100) NULL,
    n_puerta VARCHAR(10) NULL,
    referencia TEXT NULL
);

CREATE TABLE factura (
    id_factura INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    iva DECIMAL(5,2) NOT NULL,
    estado VARCHAR(50) NOT NULL
);

CREATE TABLE método_pago (
    id_método INT PRIMARY KEY AUTO_INCREMENT,
    método VARCHAR(50) NOT NULL
);


CREATE TABLE pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    monto DECIMAL(10,2) NOT NULL,
    id_método INT,
    id_factura INT,
    FOREIGN KEY (id_método) REFERENCES método_pago(id_método),
    FOREIGN KEY (id_factura) REFERENCES factura(id_factura)
);

CREATE TABLE mesa (
    id_mesa INT PRIMARY KEY AUTO_INCREMENT,
    capacidad INT NOT NULL
);

CREATE TABLE personalización_rest (
    nombre_rest VARCHAR(100) PRIMARY KEY,
    dirección_rest TEXT NULL,
    email_rest VARCHAR(100) NULL UNIQUE,
    política_cancelación TEXT NULL,
    mensaje_bienvenida TEXT NULL,
    tasa_servicio DECIMAL(5,2) NOT NULL,
    zona_horaria VARCHAR(50) NOT NULL,
    id_imagen INT,
    FOREIGN KEY (id_imagen) REFERENCES imagen(id_imagen)
);

CREATE TABLE horario_rest (
    id_horario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    horario_apertura TIME NOT NULL,
    horario_cierre TIME NOT NULL
);

CREATE TABLE período_apertura (
    id_período INT PRIMARY KEY AUTO_INCREMENT,
    fecha_inicio DATE NOT NULL,
    fecha_cierre DATE NOT NULL
);

CREATE TABLE teléfono_rest (
    id_teléfono INT PRIMARY KEY AUTO_INCREMENT,
    teléfono VARCHAR(15) NOT NULL
);

CREATE TABLE moneda_rest (
    id_moneda INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);


-- Tablas de relaciones

CREATE TABLE usuario_rol_usuario (
    id_usuario INT,
    id_rol INT,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_rol) REFERENCES rol_usuario(id_rol)
);

CREATE TABLE rol_usuario_permiso (
    id_rol INT,
    id_permiso INT,
    PRIMARY KEY (id_rol, id_permiso),
    FOREIGN KEY (id_rol) REFERENCES rol_usuario(id_rol),
    FOREIGN KEY (id_permiso) REFERENCES permiso(id_permiso)
);

CREATE TABLE cliente_preferencia_alimentaria (
    id_cliente INT,
    id_preferencia INT,
    PRIMARY KEY (id_cliente, id_preferencia),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_preferencia) REFERENCES preferencia_alimentaria(id_preferencia)
);

CREATE TABLE cliente_restricciones_dieteticas (
    id_cliente INT,
    id_restricción INT,
    PRIMARY KEY (id_cliente, id_restricción),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_restricción) REFERENCES restricciones_dieteticas(id_restricción)
);

CREATE TABLE pedido_factura (
    id_pedido INT,
    id_factura INT,
    PRIMARY KEY (id_pedido),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_factura) REFERENCES factura(id_factura)
);

CREATE TABLE mesa_pedido (
    id_pedido INT,
    id_mesa INT,
    fecha DATE,
    hora_inicio TIME,
    hora_fin TIME,
    ci VARCHAR(20),
    PRIMARY KEY (id_pedido),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_mesa) REFERENCES mesa(id_mesa)
);

CREATE TABLE pedido_producto (
    id_pedido INT,
    id_producto INT,
    cantidad INT,
    importe DECIMAL(10,2),
    nota TEXT,
    ci VARCHAR(20),
    estado VARCHAR(50),
    PRIMARY KEY (id_pedido, id_producto),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE producto_menú (
    id_producto INT,
    id_menú INT,
    PRIMARY KEY (id_producto, id_menú),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_menú) REFERENCES menú(id_menú)
);

CREATE TABLE horario_rest_cliente_mesa (
    id_horario INT,
    id_cliente INT,
    id_mesa INT,
    fecha DATE,
    hora TIME,
    cant_personas INT,
    PRIMARY KEY (id_horario, id_cliente, id_mesa),
    FOREIGN KEY (id_horario) REFERENCES horario_rest(id_horario),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_mesa) REFERENCES mesa(id_mesa)
);

CREATE TABLE moneda_rest_personalización_rest (
    id_moneda INT,
    nombre_rest VARCHAR(100),
    PRIMARY KEY (id_moneda),
    FOREIGN KEY (id_moneda) REFERENCES moneda_rest(id_moneda),
    FOREIGN KEY (nombre_rest) REFERENCES personalización_rest(nombre_rest)
);

CREATE TABLE teléfono_rest_personalización_rest (
    id_teléfono INT,
    nombre_rest VARCHAR(100),
    PRIMARY KEY (id_teléfono),
    FOREIGN KEY (id_teléfono) REFERENCES teléfono_rest(id_teléfono),
    FOREIGN KEY (nombre_rest) REFERENCES personalización_rest(nombre_rest)
);

CREATE TABLE período_apertura_horario_rest_personalización_rest (
    id_período INT,
    id_horario INT,
    nombre_rest VARCHAR(100),
    PRIMARY KEY (id_período, id_horario),
    FOREIGN KEY (id_período) REFERENCES período_apertura(id_período),
    FOREIGN KEY (id_horario) REFERENCES horario_rest(id_horario),
    FOREIGN KEY (nombre_rest) REFERENCES personalización_rest(nombre_rest)
);

-- Tabla usuario
INSERT INTO usuario (nombre, apellido, teléfono) VALUES
('Juan', 'Pérez', '1234567890'),
('Ana', 'García', '0987654321'),
('Luis', 'Martínez', '1122334455'),
('Sofía', 'López', '2233445566'),
('Carlos', 'Hernández', '3344556677');

-- Tabla rol_usuario
INSERT INTO rol_usuario (nombre, descripción) VALUES
('Administrador', 'Acceso completo al sistema'),
('Cocinero', 'Acceso a la gestión de menús y pedidos'),
('Mesero', 'Acceso a la gestión de mesas y pedidos de clientes'),
('Cliente', 'Acceso para realizar pedidos y ver menús'),
('Gerente', 'Gestión del personal y operaciones del restaurante');

-- Tabla permiso
INSERT INTO permiso (nombre, descripción) VALUES
('Ver usuarios', 'Permiso para ver la lista de usuarios'),
('Editar usuarios', 'Permiso para editar la información de usuarios'),
('Eliminar usuarios', 'Permiso para eliminar usuarios'),
('Ver pedidos', 'Permiso para ver la lista de pedidos'),
('Editar pedidos', 'Permiso para modificar pedidos');

-- Tabla cargo_empleado
INSERT INTO cargo_empleado (nombre, descripción) VALUES
('Chef', 'Responsable de la preparación de alimentos'),
('Ayudante de cocina', 'Asistente en la cocina'),
('Cajero', 'Encargado del manejo del dinero'),
('Supervisor', 'Encargado de supervisar al personal'),
('Gerente', 'Encargado de la administración general');

-- Tabla empleado
INSERT INTO empleado (ci, id_usuario, id_cargo, email, clave, fecha_nacimiento, fecha_contratación, dirección, salario, horario_entrada, horario_salida) VALUES
('12345678A', 1, 1, 'juan.perez@correo.com', 'clave123', '1980-05-20', '2020-01-15', 'Calle Falsa 123', 1500.00, '08:00', '16:00'),
('98765432B', 2, 2, 'ana.garcia@correo.com', 'clave456', '1990-07-10', '2021-03-01', 'Calle Real 456', 1200.00, '09:00', '17:00'),
('45678912C', 3, 3, 'luis.martinez@correo.com', 'clave789', '1985-11-30', '2019-09-20', 'Av. Siempre Viva 789', 1300.00, '10:00', '18:00'),
('78912345D', 4, 4, 'sofia.lopez@correo.com', 'clave321', '1995-01-15', '2022-05-10', 'Av. Central 101', 1600.00, '07:00', '15:00'),
('32165498E', 5, 5, 'carlos.hernandez@correo.com', 'clave654', '1987-03-25', '2023-06-20', 'Calle Principal 202', 1400.00, '06:00', '14:00');

-- Tabla cliente
INSERT INTO cliente (id_usuario) VALUES
(1),
(2),
(3),
(4),
(5);

-- Tabla comentario
INSERT INTO comentario (contenido, calificación, id_cliente) VALUES
('Excelente servicio!', 5, 1),
('La comida estaba fría', 2, 2),
('Muy buena atención del personal', 4, 3),
('Los precios son razonables', 4, 4),
('Me encantó el ambiente', 5, 5);

-- Tabla preferencia_alimentaria
INSERT INTO preferencia_alimentaria (nombre, descripción) VALUES
('Vegetariano', 'No consume carne'),
('Vegano', 'No consume productos de origen animal'),
('Sin gluten', 'No consume alimentos con gluten'),
('Bajo en sodio', 'Prefiere alimentos con bajo contenido de sal'),
('Sin lácteos', 'No consume productos lácteos');

-- Tabla restricciones_dieteticas
INSERT INTO restricciones_dieteticas (nombre, descripción) VALUES
('Alergia al maní', 'El cliente es alérgico al maní'),
('Alergia a los mariscos', 'El cliente es alérgico a los mariscos'),
('Alergia a la lactosa', 'El cliente no puede consumir lácteos'),
('Diabetes', 'El cliente debe evitar alimentos altos en azúcar'),
('Hipertensión', 'El cliente debe evitar alimentos altos en sodio');

-- Tabla categoría_producto
INSERT INTO categoría_producto (nombre, descripción) VALUES
('Comida Italiana', 'Platos de la gastronomía italiana'),
('Comida Rápida', 'Platos para disfrutar rápidamente'),
('Ensaladas', 'Opciones saludables a base de vegetales'),
('Sopas', 'Deliciosas sopas calientes'),
('Pastas', 'Platos basados en diferentes tipos de pasta');

-- Tabla categoría_pedido
INSERT INTO categoría_pedido (nombre, descripción) VALUES
('Domicilio', 'Pedidos para entrega a domicilio'),
('Para llevar', 'Pedidos para recoger en el restaurante'),
('En restaurante', 'Pedidos consumidos en el restaurante'),
('Catering', 'Pedidos para eventos especiales'),
('Entrega rápida', 'Pedidos con servicio express');

-- Tabla imagen
INSERT INTO imagen (ruta, tipo) VALUES
('ruta1.jpg', 'Imagen de pizza'),
('ruta2.jpg', 'Imagen de hamburguesa'),
('ruta3.jpg', 'Imagen de ensalada'),
('ruta4.jpg', 'Imagen de sopa'),
('ruta5.jpg', 'Imagen de pasta');


-- Tabla pedido
INSERT INTO pedido (subtotal, estado, id_cliente, fecha, hora, id_categoría) VALUES
(100.50, 'En preparación', 1, '2024-10-01', '12:00', 1),
(200.75, 'Entregado', 2, '2024-10-02', '13:00', 2),
(150.25, 'Cancelado', 3, '2024-10-03', '14:00', 3),
(175.00, 'Pendiente', 4, '2024-10-04', '15:00', 4),
(120.60, 'En camino', 5, '2024-10-05', '16:00', 5);

-- Tabla producto
INSERT INTO producto (nombre, precio, descripción, id_categoría, id_imagen) VALUES
('Pizza Margarita', 12.50, 'Pizza con salsa de tomate y albahaca', 1, 1),
('Hamburguesa Doble', 10.00, 'Hamburguesa con doble carne y queso', 2, 2),
('Ensalada César', 8.75, 'Ensalada con lechuga, pollo y aderezo', 3, 3),
('Sopa de Mariscos', 15.00, 'Sopa con una mezcla de mariscos frescos', 4, 4),
('Pasta Carbonara', 13.50, 'Pasta con salsa cremosa de tocino', 5, 5);

-- Tabla menú
INSERT INTO menú (nombre, descripción) VALUES
('Menú Almuerzo', 'Menú disponible solo durante el almuerzo'),
('Menú Cena', 'Menú disponible solo durante la cena'),
('Menú Infantil', 'Menú diseñado especialmente para niños'),
('Menú Ejecutivo', 'Menú para el público empresarial'),
('Menú Vegetariano', 'Menú para clientes que no consumen carne');


-- Tabla dirección
INSERT INTO dirección (calle, esquina, n_puerta, referencia) VALUES
('Av. Independencia', 'Esquina Libertad', '45', 'Frente al parque'),
('Calle Central', NULL, '101', 'Al lado de la farmacia'),
('Boulevard Principal', 'Esquina Norte', '22', 'Cerca del centro comercial'),
('Calle Secundaria', NULL, '33', 'Frente al hospital'),
('Av. Libertador', 'Esquina Sur', '78', 'Cerca de la universidad');

-- Tabla factura
INSERT INTO factura (fecha, hora, total, iva, estado) VALUES
('2024-10-01', '12:30', 105.53, 10.50, 'Pagado'),
('2024-10-02', '13:30', 210.78, 21.00, 'Pendiente'),
('2024-10-03', '14:30', 157.76, 15.80, 'Cancelado'),
('2024-10-04', '15:30', 180.25, 18.00, 'Pagado'),
('2024-10-05', '16:30', 126.63, 12.50, 'Pendiente');

-- Tabla método_pago
INSERT INTO método_pago (método) VALUES
('Tarjeta de crédito'),
('Efectivo'),
('Transferencia bancaria'),
('PayPal'),
('Criptomonedas');


-- Tabla pago
INSERT INTO pago (monto, id_método, id_factura) VALUES
(105.53, 1, 1),
(210.78, 2, 2),
(157.76, 3, 3),
(180.25, 4, 4),
(126.63, 5, 5);


-- Tabla mesa
INSERT INTO mesa (capacidad) VALUES
(4),
(6),
(2),
(8),
(10);


-- Tabla producto_categoria
INSERT INTO producto_categoria  VALUES 
(1,1),
(2,2),
(3,3),
(4,3),
(5,4),
(1,2);
