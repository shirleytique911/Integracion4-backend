import { Router } from "express";
import UserDTO from "../dao/DTOs/user.dto.js";
import { userService } from "../repositories/index.js";
import Users from "../dao/mongo/users.mongo.js"

const router = Router()

const usersMongo = new Users()

//Obtener Usuarios
router.get("/", async (req, res) => {
  try {
    req.logger.info('Se cargan usuarios');
    let result = await usersMongo.get()
    res.status(200).send({ status: "success", payload: result });
  }
  catch (error) {
    req.logger.error('Error al cargar usuarios');
    res.status(500).send({ status: "error", message: "Error interno del servidor" });
  }
})
//Crear Usuarios
router.post("/", async (req, res) => {
  try {
    let { first_name, last_name, email, age, password, rol } = req.body
    let user = new UserDTO({ first_name, last_name, email, age, password, rol })
    let result = await userService.createUser(user)
    if (result) {
      req.logger.info('Se crea Usuario correctamente');
    } else {
      req.logger.error("Error al crear Usuario");
    }
    res.status(200).send({ status: "success", payload: result });
  }
  catch (error) {
    res.status(500).send({ status: "error", message: "Error interno del servidor" });
  }
})

//Actualizar Rol Usuario
router.post("/premium/:uid", async (req, res) => {
  try {
    const { rol } = req.body;
    const allowedRoles = ['premium', 'admin', 'usuario'];
    const uid = req.params.uid;

    if (!allowedRoles.includes(rol)) {
      req.logger.error('Rol no válido proporcionado');
      return res.status(400).json({ error: 'Rol no válido' });
    }

    let changeRol = await userService.updUserRol({ uid, rol });

    if (changeRol) {
      req.logger.info('Se actualiza rol correctamente');
      res.status(200).json({ message: 'Rol actualizado correctamente' });
    } else {
      req.logger.error('Error al actualizar el rol');
      res.status(500).json({ error: 'Error al actualizar el rol' });
    }
  } catch (error) {
    req.logger.error('Error en la ruta /premium/:uid');
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router