CREATE DATABASE chefhub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chefhub_db;

CREATE TABLE personalizacion (
color varchar (50));

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
)ENGINE=InnoDB;

-- Tabla funcionario
CREATE TABLE funcionario (
    id_usuario INT NOT NULL,
    ci VARCHAR(8) PRIMARY KEY,
    fecha_nacimiento DATE NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    horario_entrada TIME NOT NULL,
    horario_salida TIME NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    baja INT DEFAULT 0, 
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

-- Tabla cliente
CREATE TABLE cliente (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    baja INT DEFAULT 0 
) ENGINE=InnoDB;

-- Tabla token
CREATE TABLE token (
    id_token INT AUTO_INCREMENT PRIMARY KEY,
    email varchar(50) NOT NULL,
    token VARCHAR (6) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT NOW(),
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

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
)ENGINE=InnoDB;

-- Tabla factura
CREATE TABLE factura (
    id_factura INT PRIMARY KEY AUTO_INCREMENT,
    fecha_hora DATETIME DEFAULT current_timestamp NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

-- Tabla pago
CREATE TABLE pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    id_factura INT NOT NULL,
    FOREIGN KEY (id_factura) REFERENCES factura(id_factura),
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

-- Tabla producto
CREATE TABLE producto (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    descripcion TEXT,
    imagen text,
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

-- Tabla categoria_producto
CREATE TABLE categoria_producto (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    imagen text,
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

-- Tabla mesa
CREATE TABLE mesa (
    id_mesa INT PRIMARY KEY,
    capacidad INT NOT NULL,
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

-- Tabla pedido
CREATE TABLE pedido (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    subtotal DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    id_cliente INT NOT NULL,
    id_direccion INT NULL,
    id_factura INT NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP, 
    ci varchar (8),
    baja TINYINT DEFAULT 0,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_direccion) REFERENCES direccion(id_direccion),
    FOREIGN KEY (id_factura) REFERENCES factura(id_factura),
	CONSTRAINT chk_categoria CHECK (categoria != 'Delivery' OR id_direccion IS NOT NULL)
    )ENGINE=InnoDB;
    
-- Tabla dia_horario
CREATE TABLE dia_horario (
    dia_semana VARCHAR(10) PRIMARY KEY,
    horario_apertura TIME NOT NULL,
    horario_cierre TIME NOT NULL,
    duracion_reserva TIME NOT NULL,
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

-- Tabla excepcion_horario
CREATE TABLE excepcion_horario (
    fecha DATE PRIMARY KEY,
    horario_apertura TIME NOT NULL,
    horario_cierre TIME NOT NULL,
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

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
)ENGINE=InnoDB;

CREATE TABLE mesa_pedido (
    id_pedido INT NOT NULL,
    id_mesa INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME,
    PRIMARY KEY (id_pedido, id_mesa),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_mesa) REFERENCES mesa(id_mesa),
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

CREATE TABLE producto_categoria (
    id_producto INT NOT NULL,
    id_categoria INT NOT NULL,
    PRIMARY KEY (id_producto, id_categoria),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_categoria) REFERENCES categoria_producto(id_categoria),
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

CREATE TABLE ingrediente (
    id_ingrediente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

CREATE TABLE pedido_producto (
	id_pedido_producto INT AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    importe DECIMAL(10, 2) NOT NULL,
    nota TEXT,
    PRIMARY KEY (id_pedido_producto),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

-- Tabla para saber que ingredientes lleva cada producto dentro del pedido (incluyendo ingredientes base)
CREATE TABLE pedido_ingrediente (
    id_pedido_producto INT NOT NULL,
    id_ingrediente INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_pedido_producto) REFERENCES pedido_producto(id_pedido_producto),
    FOREIGN KEY (id_ingrediente) REFERENCES ingrediente(id_ingrediente)
)ENGINE=InnoDB;

-- Tabla para asociar los ingredientes base y extra (se pueden agregar en el pedido)
CREATE TABLE producto_ingrediente (
    id_producto INT NOT NULL,
    id_ingrediente INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    extra BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (id_producto, id_ingrediente),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_ingrediente) REFERENCES ingrediente(id_ingrediente),
    baja INT DEFAULT 0 
)ENGINE=InnoDB;

-- Índices recomendados
CREATE INDEX idx_cliente ON cliente(id_cliente);
CREATE INDEX idx_pedido ON pedido(id_pedido);
CREATE INDEX idx_fecha_hora_pedido ON pedido(fecha_hora);
CREATE INDEX idx_mesa ON mesa(id_mesa);

-- Auditoría

CREATE TABLE pedido_auditoria (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    fecha_modificacion DATETIME NOT NULL DEFAULT NOW(),
    estado_anterior VARCHAR(50) NOT NULL,
    estado_nuevo VARCHAR(50) NOT NULL,
    ci_anterior VARCHAR(8) NULL,  -- Guarda la cédula anterior del pedido
    ci_nuevo VARCHAR(8) NULL,     -- Guarda la cédula nueva del pedido
    ci VARCHAR(8) NOT NULL,       -- Guarda la cédula del usuario que hizo el cambio
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
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
CREATE TABLE cliente_mesa_auditoria (
    id_auditoria INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    id_mesa INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    cant_personas INT NOT NULL,
    nombre_reserva VARCHAR(20) NOT NULL,
    tel_contacto INT NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20),
    accion VARCHAR(10) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    fecha_modificacion DATETIME NOT NULL DEFAULT NOW()
);

-- Trigers para cada una de las tablas auditorias
DELIMITER $$

CREATE TRIGGER trg_pedido_ci_auditoria
BEFORE UPDATE ON pedido
FOR EACH ROW
BEGIN
    -- Si la cédula (ci) cambió, guardar en la auditoría
    IF OLD.ci <> NEW.ci THEN
        INSERT INTO pedido_auditoria (id_pedido, fecha_modificacion, estado_anterior, estado_nuevo, ci_anterior, ci_nuevo, ci)
        VALUES (OLD.id_pedido, NOW(), OLD.estado, NEW.estado, OLD.ci, NEW.ci, @usuario_ci);
    END IF;
END $$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER trg_factura_auditoria
BEFORE UPDATE ON factura
FOR EACH ROW
BEGIN
    IF OLD.estado <> NEW.estado THEN
        INSERT INTO factura_auditoria (id_factura, estado_anterior, estado_nuevo)
        VALUES (OLD.id_factura, OLD.estado, NEW.estado);
    END IF;
END $$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER trg_pago_auditoria
BEFORE UPDATE ON pago
FOR EACH ROW
BEGIN
    IF OLD.monto <> NEW.monto THEN
        INSERT INTO pago_auditoria (id_pago, monto_anterior, monto_nuevo)
        VALUES (OLD.id_pago, OLD.monto, NEW.monto);
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_cliente_mesa_auditoria
AFTER INSERT ON cliente_mesa
FOR EACH ROW
BEGIN
    INSERT INTO cliente_mesa_auditoria (id_cliente, id_mesa, fecha, hora, cant_personas, nombre_reserva, tel_contacto, estado_nuevo, accion)
    VALUES (NEW.id_cliente, NEW.id_mesa, NEW.fecha, NEW.hora, NEW.cant_personas, NEW.nombre_reserva, NEW.tel_contacto, NEW.estado, 'INSERT');
END $$

DELIMITER ;

/*DATOS DE PRUEBA*/

/*Color principal*/

INSERT INTO personalizacion VALUES ('#ab8ef4');

/*Usuarios*/

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
('pedro@example.com', 'clave707', 'Pedro', 'Perez', '445566778'),
('andres@example.com', 'clave808', 'Andres', 'Gutierrez', '556644332'),
('laura@example.com', 'clave909', 'Laura', 'Ramirez', '667755889'),
('fernando@example.com', 'clave1010', 'Fernando', 'Alvarez', '778866991'),
('camila@example.com', 'clave1111', 'Camila', 'Herrera', '889977223'),
('diego@example.com', 'clave1212', 'Diego', 'Ortega', '990088334'),
('valentina@example.com', 'clave1313', 'Valentina', 'Rojas', '112200445'),
('sebastian@example.com', 'clave1414', 'Sebastian', 'Jimenez', '223311556'),
('martina@example.com', 'clave1515', 'Martina', 'Castro', '334422667'),
('ricardo@example.com', 'clave1616', 'Ricardo', 'Vega', '445533778'),
('elena@example.com', 'clave1717', 'Elena', 'Flores', '556644889'),
('daniel@example.com', 'clave1818', 'Daniel', 'Silva', '667755990'),
('natalia@example.com', 'clave1919', 'Natalia', 'Mendoza', '778866221'),
('alejandro@example.com', 'clave2020', 'Alejandro', 'Reyes', '889977332'),
('mariana@example.com', 'clave2121', 'Mariana', 'Paredes', '990088443'),
('francisco@example.com', 'clave2222', 'Francisco', 'Delgado', '112233554'),
('paula@example.com', 'clave2323', 'Paula', 'Cabrera', '223344665'),
('gustavo@example.com', 'clave2424', 'Gustavo', 'Romero', '334455776'),
('isabel@example.com', 'clave2525', 'Isabel', 'Peña', '445566887'),
('jorge@example.com', 'clave2626', 'Jorge', 'Navarro', '556677998'),
('veronica@example.com', 'clave2727', 'Veronica', 'Lara', '667788009'),
('roberto@example.com', 'clave2828', 'Roberto', 'Fuentes', '778899110'),
('carolina@example.com', 'clave2929', 'Carolina', 'Salazar', '889900221'),
('hector@example.com', 'clave3030', 'Hector', 'Espinoza', '990011332'),
('julieta@example.com', 'clave3131', 'Julieta', 'Vargas', '112244553'),
('manuel@example.com', 'clave3232', 'Manuel', 'Cortes', '223355664'),
('adriana@example.com', 'clave3333', 'Adriana', 'Molina', '334466775'),
('cristian@example.com', 'clave3434', 'Cristian', 'Mejia', '445577886'),
('daniela@example.com', 'clave3535', 'Daniela', 'Guerrero', '556688997'),
('esteban@example.com', 'clave3636', 'Esteban', 'Castaño', '667799008'),
('miranda@example.com', 'clave3737', 'Miranda', 'Soto', '778800119');

/*Funcionarios*/

INSERT INTO funcionario (id_usuario, ci, fecha_nacimiento, direccion, horario_entrada, horario_salida, cargo) VALUES
('1', '29578412', '1982-07-15', 'Av. San Martín 1800', '09:00:00', '17:00:00', 'Chef'),
('2', '18089266', '1978-03-22', 'Calle Belgrano 250', '12:00:00', '20:00:00', 'Chef'),
('3', '31682045', '1990-11-05', 'Av. Rivadavia 3021', '14:00:00', '22:00:00', 'Chef'),
('4', '29842010', '1995-09-10', 'Calle Mitre 456', '10:00:00', '18:00:00', 'Mesero'),
('5', '46517204', '1988-06-30', 'Av. Corrientes 1340', '16:00:00', '23:00:00', 'Mesero'),
('6', '42108573', '1997-04-18', 'Calle San Juan 765', '11:00:00', '19:00:00', 'Mesero'),
('7', '38751230', '1985-12-07', 'Av. Libertador 2200', '17:00:00', '23:00:00', 'Mesero'),
('8', '37412658', '1993-05-25', 'Calle Mendoza 980', '10:00:00', '18:00:00', 'Mesero'),
('9', '25984731', '1980-02-14', 'Calle Lavalle 1500', '08:30:00', '16:30:00', 'Administrativo'),
('10', '30654287', '1984-08-09', 'Av. Pueyrredón 750', '09:00:00', '17:00:00', 'Administrativo');

/*Clientes*/

-- Insertar datos en la tabla cliente
INSERT INTO cliente (id_usuario) VALUES
(11), (12), (13), (14), (15), (16), (17), (18), (19), (20), 
(21), (22), (23), (24), (25), (26), (27), (28), (29);

/*Mesas*/

-- Insertar datos en la tabla mesa
INSERT INTO mesa (id_mesa, capacidad) VALUES
(1,4), (2,4), (3,2), (4,2), (5,2), (6,6), (7,4), (8,2), (9,4), (10,6), (11,6), (12,4), (13,2), (14,4), (15,2);

/*Reservas*/

INSERT INTO cliente_mesa (id_cliente, id_mesa, fecha, hora, cant_personas, nombre_reserva, tel_contacto, estado) VALUES
(3, 1, '2025-02-01', '10:00:00', 4, 'Fernando', 778866991, 'Reservada'),
(1, 5, '2025-02-02', '12:00:00', 2, 'Andres', 556644332, 'Reservada'),
(2, 3, '2025-02-05', '14:00:00', 2, 'Luis', 112233445, 'Reservada'),
(4, 7, '2025-02-10', '16:00:00', 4, 'Camila', 889977223, 'Reservada'),
(5, 2, '2025-02-15', '18:00:00', 4, 'Diego', 990088334, 'Reservada'),

(6, 4, '2025-02-01', '11:00:00', 2, 'Valentina', 112200445, 'Reservada'),
(2, 6, '2025-02-02', '13:00:00', 6, 'Ricardo', 778899001, 'Reservada'),
(3, 8, '2025-02-05', '15:00:00', 2, 'Elena', 998877665, 'Reservada'),
(1, 9, '2025-02-10', '17:00:00', 4, 'Andres', 556644332, 'Reservada'),
(7, 10, '2025-02-15', '19:00:00', 6, 'Sebastian', 223311556, 'Reservada'),

(8, 11, '2025-02-01', '12:00:00', 2, 'Gabriel', 111222333, 'Reservada'),
(9, 12, '2025-02-02', '14:00:00', 4, 'Ricardo', 445533778, 'Reservada'),
(10, 13, '2025-02-05', '16:00:00', 6, 'Elena', 556644889, 'Reservada'),
(11, 14, '2025-02-10', '18:00:00', 6, 'Laura', 666777888, 'Reservada'),
(12, 15, '2025-02-15', '20:00:00', 4, 'Natalia', 778866221, 'Reservada'),

(5, 6, '2025-02-01', '13:00:00', 4, 'Diego', 990088334, 'Reservada'),
(3, 7, '2025-02-02', '15:00:00', 4, 'Daniel', 321321321, 'Reservada'),
(1, 8, '2025-02-05', '17:00:00', 4, 'Andres', 556644332, 'Reservada'),
(2, 9, '2025-02-10', '19:00:00', 2, 'Mario', 654654654, 'Reservada'),
(4, 10, '2025-02-15', '21:00:00', 4, 'Camila', 889977223, 'Reservada'),

(6, 11, '2025-02-01', '14:00:00', 2, 'Valentina', 112200445, 'Reservada'),
(7, 12, '2025-02-02', '16:00:00', 4, 'Sebastian', 223311556, 'Reservada'),
(8, 13, '2025-02-05', '18:00:00', 2, 'Martina', 334422667, 'Reservada'),
(9, 14, '2025-02-10', '20:00:00', 4, 'Ricardo', 445533778, 'Reservada'),
(10, 15, '2025-02-15', '22:00:00', 6, 'Elena', 556644889, 'Reservada');

/*Horarios del restaurant*/

INSERT INTO dia_horario (dia_semana, horario_apertura, horario_cierre, duracion_reserva) VALUES
('Monday', '09:00:00', '22:00:00','3:00:00'),
('Tuesday', '09:00:00', '22:00:00','3:00:00'),
('Wednesday', '09:00:00', '22:00:00','3:00:00'),
('Thursday', '09:00:00', '22:00:00','3:00:00'),
('Friday', '09:00:00', '23:00:00','3:00:00'),
('Saturday', '10:00:00', '23:00:00','3:00:00'),
('Sunday', '10:00:00', '21:00:00','3:00:00');

/*Categorias*/

INSERT INTO `chefhub_db`.`categoria_producto` (`nombre`, `imagen`) VALUES 
('Empanadas', 'uploads/empanadas-categoria.webp'),
('Guarniciones', 'uploads/guarniciones-categoria.jpg'),
('Tragos', 'uploads/tragos-categoria.jpeg'),
('Tequeños', 'uploads/tequeños-categoria.webp'),
('Pizzas', 'uploads/pizzas-categoria.jpg'),
('Hamburgesas', 'uploads/hamburgesas-categoria.jpeg');

/*Hamburgesas*/

INSERT INTO `chefhub_db`.`producto` (`nombre`, `precio`, `descripcion`, `imagen`) VALUES
('Hamburguesa Doble', 450, 'Hamburguesa doble carne con queso, lechuga, tomate y aderezos en un pan esponjoso.', 'uploads/GreatAmericanBurger__FillWzExNzAsNTgzXQ.jpg'),
('Hamburguesa Bacon Cheddar', 400, 'Deliciosa hamburguesa con tocino crujiente, queso cheddar derretido y cebolla caramelizada.', 'uploads/a-smashed-double-bacon-cheeseburger-2.jpg'),
('Hamburguesa Cheddar Melt', 400, 'Hamburguesa con carne jugosa, abundante queso cheddar derretido y cebolla salteada.', 'uploads/original.png'),
('Hamburguesa BBQ', 400, 'Clásica hamburguesa con salsa barbacoa, cebolla crispy, queso cheddar y tocino.', 'uploads/original-2.png'),
('Hamburguesa con Champiñones y Queso', 400, 'Hamburguesa con champiñones salteados, queso suizo derretido y salsa especial.', 'uploads/Mushroom-Swiss-Burger-1200x1200-1.jpg'),
('Hamburguesa de Pollo', 350, 'Hamburguesa de pechuga de pollo empanizada con lechuga, tomate y mayonesa.', 'uploads/Hamburguesa-de-pollo-picante.webp'),
('Hamburguesa Vegetariana', 350, 'Hamburguesa hecha con una mezcla de vegetales, garbanzos y especias, acompañada de aderezo especial.', 'uploads/1366_2000.jpeg'),
('Hamburguesa Hawaiana', 350, 'Hamburguesa con piña a la parrilla, queso suizo y salsa teriyaki.', 'uploads/hawaiana.jpeg'),
('Hamburguesa de Pescado', 350, 'Filete de pescado empanizado con lechuga fresca y salsa tártara en un pan suave.', 'uploads/DC_202401_3933-999_DoubleFilet-O-Fish_WholeSlice_1564x1564-1_product-header-mobile.jpeg');

INSERT INTO `chefhub_db`.`producto_categoria` (`id_producto`, `id_categoria`) VALUES 
(1, 6),
(2, 6),
(3, 6),
(4, 6),
(5, 6),
(6, 6),
(7, 6),
(8, 6),
(9, 6);

/*Empanadas*/

INSERT INTO `chefhub_db`.`producto` (`nombre`, `precio`, `descripcion`, `imagen`) VALUES 
('Empanada de Carne', '70', 'Rellena de carne de res o cerdo picada o molida, generalmente con cebolla, pimientos y especias', 'uploads/Empanadas-open-e1631296397215.jpeg'), 
('Empanada de Pollo', '70', 'Contiene pollo desmenuzado con cebolla, ajo y a veces pimentón o aceitunas', 'uploads/iStock-1437638745-Empanadas-de-pollo-scaled-1924x1924.jpeg'),
('Empanada de Jamón y Queso', '70', 'Lleva jamón y queso derretido, con una textura cremosa y un sabor suave', 'uploads/9beabeb653ad-empanadillas-jamon-queso-t.webp'),
('Empanada de Queso', '70', 'Solo con queso, que puede ser mozzarella, queso crema o queso fresco, perfecta para los amantes del queso derretido.', 'uploads/queso-solo-fritas.jpeg'),
('Empanada de Espinaca y Queso', '70', 'Relleno de espinaca cocida mezclada con queso, a veces con un toque de ricotta', 'uploads/DSC_0588-scaled.webp'),
('Empanada de Atún', '70', 'Contiene atún en conserva mezclado con cebolla, huevo y a veces aceitunas', 'uploads/empanadas-de-atun.jpeg'),
('Empanada Caprese', '70', 'Inspirada en la ensalada caprese, con tomate, mozzarella y albahaca', 'uploads/amadomarketubereats-36_2048x.webp'),
('Empanada de Humita', '70', 'Lleva una mezcla de choclo (maíz) cremoso con queso y a veces un toque de ají o azúcar', 'uploads/CU37R2OQZBFUDON4JT2JQASXPQ.webp'),
('Empanada Dulce', '70', 'Puede estar rellena de dulce de leche o pasta de membrillo, ideal como postre', 'uploads/41d37854b3024e002c05800e592e76b7.jpeg');

INSERT INTO `chefhub_db`.`producto_categoria` (`id_producto`, `id_categoria`) VALUES 
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1);

/*Pizzas*/

INSERT INTO `chefhub_db`.`producto` (`nombre`, `precio`, `descripcion`, `imagen`) VALUES 
('Pizza Margarita', '450', 'Clásica italiana con salsa de tomate, mozzarella y hojas de albahaca fresca.', 'uploads/D2KL4RRCRJA7RJC5TNULFZEKR4.jpg'),
('Pizza Pepperoni', '450','Lleva salsa de tomate, queso mozzarella y rodajas de pepperoni, que se doran y sueltan su grasa característica.', 'uploads/receta-de-pizza-de-pepperoni.jpg'),
('Pizza Cuatro Quesos', '450','Mezcla de cuatro quesos (generalmente mozzarella, gorgonzola, parmesano y provolone) para un sabor fuerte y cremoso.', 'uploads/Pizza-cuatro-quesos-shutterstock_1514858234.jpg'),
('Pizza Napolitana', '450','Similar a la Margarita, pero con rodajas de tomate fresco y aceitunas.', 'uploads/Para-la-masa-de-pizza-napolitana-8-hrs-fermentacion-Web-1.jpg'),
('Pizza Hawaiana', '450','Contiene jamón y piña, creando una combinación de dulce y salado que genera debate.', 'uploads/0193adc6-9a5a-774c-982b-fa934194885d.jpeg'),
('Pizza Fugazzeta', '350','Pizza argentina con una capa gruesa de queso mozzarella y mucha cebolla caramelizada.', 'uploads/fugazzeta-pizza-argentina-rellena-aceituna.jpg'),
('Pizza BBQ Chicken', '450','Lleva pollo desmenuzado, salsa barbacoa en lugar de tomate, cebolla morada y queso.', 'uploads/1382541346030.webp'),
('Pizza Vegetariana', '350','Cargada con verduras como pimientos, champiñones, cebolla, tomate y aceitunas.', 'uploads/Pizza-Veggie-Supreme-blog.web'),
('Pizza Carbonara', '450','Inspirada en la pasta carbonara, con salsa blanca, panceta, huevo y queso pecorino o parmesano.', 'uploads/receta-pizza-carbonara.jpg');

INSERT INTO `chefhub_db`.`producto_categoria` (`id_producto`, `id_categoria`) VALUES 
(19, 5),
(20, 5),
(21, 5),
(22, 5),
(23, 5),
(24, 5),
(25, 5),
(26, 5),
(27, 5);
INSERT INTO direccion (id_usuario, calle, apto, n_puerta, referencia) VALUES
(1, 'Av. Libertador', 'Apto 101', 123, 'Frente al parque central'),
(2, 'Calle Principal', 'Apto 202', 456, 'Cerca del supermercado'),
(3, 'Av. Siempre Viva', 'Apto 303', 789, 'Al lado de la escuela'),
(4, 'Calle Falsa', 'Apto 404', 321, 'Esquina con la farmacia'),
(5, 'Av. Revolución', 'Apto 505', 654, 'Frente al centro comercial'),
(6, 'Calle Nueva', 'Apto 606', 987, 'Cerca del estadio'),
(7, 'Av. Independencia', 'Apto 707', 111, 'Frente a la plaza'),
(8, 'Calle Vieja', 'Apto 808', 222, 'Al lado del banco'),
(9, 'Av. Libertad', 'Apto 909', 333, 'Cerca del hospital');
INSERT INTO factura (fecha_hora, total, estado) VALUES
('2023-10-01 12:00:00', 50.00, 'Pagado'),
('2023-10-02 13:30:00', 75.00, 'Pagado'),
('2023-10-03 14:45:00', 100.00, 'Pendiente'),
('2023-10-04 15:00:00', 30.00, 'Pagado'),
('2023-10-05 16:30:00', 45.00, 'Pagado'),
('2023-10-06 17:45:00', 60.00, 'Pendiente'),
('2023-10-07 18:00:00', 80.00, 'Pagado'),
('2023-10-08 19:30:00', 120.00, 'Pagado'),
('2023-10-09 20:45:00', 150.00, 'Pendiente');


INSERT INTO pago (monto, metodo_pago, id_factura) VALUES
(50.00, 'Tarjeta', 1),
(75.00, 'Efectivo', 2),
(100.00, 'Tarjeta', 3),
(30.00, 'Efectivo', 4),
(45.00, 'Tarjeta', 5),
(60.00, 'Tarjeta', 6),
(80.00, 'Tarjeta', 7),
(120.00, 'Efectivo', 8),
(150.00, 'Tarjeta', 9);


INSERT INTO pedido (subtotal, estado, categoria, id_cliente, id_direccion, id_factura, ci) VALUES
(50.00, 'Completado', 'Delivery', 1, 1, 1, '12345678'),
(75.00, 'En proceso', 'Mesa', 2, NULL, 2, '87654321'),
(100.00, 'Pendiente', 'Delivery', 3, 2, 3, '11223344'),
(30.00, 'Completado', 'Delivery', 4, 3, 4, '44332211'),
(45.00, 'En proceso', 'Mesa', 5, NULL, 5, '55667788'),
(60.00, 'Pendiente', 'Delivery', 6, 4, 6, '99887766'),
(80.00, 'Completado', 'Delivery', 7, 5, 7, '33445566'),
(120.00, 'En proceso', 'Mesa', 8, NULL, 8, '77889900'),
(150.00, 'Pendiente', 'Delivery', 9, 6, 9, '11223399');

INSERT INTO pedido_producto (id_pedido, id_producto, cantidad, importe, nota) VALUES
(1, 1, 2, 20.00, 'Sin cebolla'),
(1, 2, 1, 15.00, 'Extra queso'),
(2, 3, 3, 45.00, 'Bien cocido'),
(2, 4, 1, 10.00, 'Sin picante'),
(3, 5, 2, 30.00, 'Para llevar'),
(3, 6, 1, 25.00, 'Sin mostaza'),
(4, 10, 3, 15.00, ''),
(4, 11, 2, 10.00, ''),
(5, 12, 4, 20.00, ''),
(5, 13, 1, 5.00, ''),
(6, 14, 5, 25.00, ''),
(6, 15, 3, 15.00, ''),
(7, 19, 1, 40.00, ''),
(7, 20, 1, 40.00, ''),
(8, 21, 2, 60.00, ''),
(8, 22, 1, 60.00, ''),
(9, 23, 3, 90.00, ''),
(9, 24, 2, 60.00, '');

-- Insertar datos en la tabla ingrediente
INSERT INTO ingrediente (nombre, precio) VALUES
-- Ingredientes base para hamburguesas
('Pan de hamburguesa', 2.00),
('Carne de res', 5.00),
('Lechuga', 1.00),
('Tomate', 1.50),
('Queso cheddar', 3.00),
-- Ingredientes base para empanadas
('Masa de empanada', 2.00),
('Carne molida', 4.00),
('Pollo desmenuzado', 4.00),
('Jamón', 3.00),
('Queso mozzarella', 3.00),
-- Ingredientes base para pizzas
('Masa de pizza', 5.00),
('Salsa de tomate', 2.00),
('Queso mozzarella', 4.00),
('Pepperoni', 3.00),
('Champiñones', 2.50),
-- Ingredientes extra
('Bacon', 2.50),
('Cebolla caramelizada', 2.00),
('Aceitunas', 1.50),
('Pimiento', 1.50),
('Piña', 2.00);


INSERT INTO producto_ingrediente (id_producto, id_ingrediente, cantidad, extra) VALUES
-- Hamburguesa básica (id_producto = 1)
(1, 1, 1, false), -- Pan de hamburguesa
(1, 2, 1, false), -- Carne de res
(1, 3, 1, false), -- Lechuga
(1, 4, 1, false), -- Tomate
(1, 5, 1, false), -- Queso cheddar
(2, 1, 1, false), -- Pan de hamburguesa
(2, 2, 1, false), -- Carne de res
(2, 3, 1, false), -- Lechuga
(2, 4, 1, false), -- Tomate
(2, 5, 1, false), -- Queso cheddar
(2, 16, 1, true); -- Bacon (extra)

-- Empanadas (id_producto 10-18)
INSERT INTO producto_ingrediente (id_producto, id_ingrediente, cantidad, extra) VALUES
(10, 6, 1, false), -- Masa de empanada
(10, 7, 1, false), -- Carne molida
(11, 6, 1, false), -- Masa de empanada
(11, 8, 1, false), -- Pollo desmenuzado
(12, 6, 1, false), -- Masa de empanada
(12, 9, 1, false), -- Jamón
(12, 10, 1, false); -- Queso mozzarella

INSERT INTO producto_ingrediente (id_producto, id_ingrediente, cantidad, extra) VALUES
-- Pizza Margarita (id_producto = 19)
(19, 11, 1, false), -- Masa de pizza
(19, 12, 1, false), -- Salsa de tomate
(19, 13, 1, false), -- Queso mozzarella
(20, 11, 1, false), -- Masa de pizza
(20, 12, 1, false), -- Salsa de tomate
(20, 13, 1, false), -- Queso mozzarella
(20, 14, 1, false); -- Pepperoni


INSERT INTO pedido_ingrediente (id_pedido_producto, id_ingrediente, cantidad) VALUES
(1, 1, 1), -- Pan de hamburguesa
(1, 2, 1), -- Carne de res
(1, 3, 1), -- Lechuga
(1, 4, 1), -- Tomate
(1, 5, 1), -- Queso cheddar
(1, 16, 1); -- Bacon (extra)

INSERT INTO pedido_ingrediente (id_pedido_producto, id_ingrediente, cantidad) VALUES
(4, 6, 1), -- Masa de empanada
(4, 7, 1); -- Carne molida

INSERT INTO pedido_ingrediente (id_pedido_producto, id_ingrediente, cantidad) VALUES
(7, 11, 1), -- Masa de pizza
(7, 12, 1), -- Salsa de tomate
(7, 13, 1), -- Queso mozzarella
(7, 14, 1); -- Pepperoni

