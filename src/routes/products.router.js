import { Router } from "express";
import ProductDTO from "../dao/DTOs/product.dto.js";
import { productService, userService } from "../repositories/index.js";
import Products from "../dao/mongo/products.mongo.js"
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

const router = Router()

const productMongo = new Products()

//Obtener productos
router.get("/", async (req, res) => {
    try
    {
        req.logger.info('Se cargan productos');
        let result = await productMongo.get()
        res.status(200).send({ status: "success", payload: result });
    } 
    catch (error) 
    {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})
//Crear producto
router.post("/", async (req, res) => {
    let { description, image, price, stock, category, availability, owner } = req.body
    if (owner === undefined || owner == '') {
        owner = 'admin@admin.cl'
    }
    const product = { description, image, price, stock, category, availability, owner }
    if (!description || !price) {
        try {
            // Some code that might throw an error
            throw CustomError.createError({
                name: 'Error en Creacion de Producto',
                cause: generateProductErrorInfo(product),
                message: 'Error al intentar crear el Producto',
                code: EErrors.REQUIRED_DATA,
            });
            req.logger.info('Se crea producto correctamente');
        } catch (error) {
            req.logger.error("Error al comparar contraseñas: " + error.message);
            res.status(500).send({ status: "error", message: "Error interno del servidor" });
        }
    }
    let prod = new ProductDTO({ description, image, price, stock, category, availability, owner })
    let userPremium = await userService.getRolUser(owner)
    if (userPremium == 'premium') {
        let result = await productService.createProduct(prod)
        res.status(200).send({ status: "success", payload: result });
        req.logger.info('Se crea producto con usuario premium');
    } else {
        req.logger.error("El owner debe contener usuarios premium");
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})

export default router