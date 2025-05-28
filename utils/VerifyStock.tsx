import { ICartProduct, IProduct } from "@/interfaces";
import axios from "axios";

export const verificarStockCarrito = async (cart: ICartProduct[]): Promise<ICartProduct[]> => {
    try {
      const { data: products }: { data: IProduct[] } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);

      const carritoFiltrado = cart.filter(cartItem => {
        const productoBase = products.find(p => p.slug === cartItem.slug);

        if (!productoBase) return false;

        // Si no tiene variaciones
        if (!cartItem.variation || !productoBase.variations || productoBase.variations.variations.length === 0) {
          return productoBase.stock >= cartItem.quantity;
        }

        // Buscar la combinación exacta de variaciones
        const variacion = productoBase.variations.variations.find(v =>
          v.variation === cartItem.variation?.variation &&
          (v.subVariation === cartItem.variation?.subVariation || !v.subVariation) &&
          (v.subVariation2 === cartItem.variation?.subVariation2 || !v.subVariation2)
        );

        if (!variacion) return false;

        return variacion.stock >= cartItem.quantity;
      });

      return carritoFiltrado;
    } catch (error) {
      console.error("Error al verificar stock del carrito:", error);
      return cart; // En caso de error, no filtra nada
    }
  };