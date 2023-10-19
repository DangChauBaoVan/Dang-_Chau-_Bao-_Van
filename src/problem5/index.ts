import express, { Request, Response } from 'express';
import { Sequelize, DataTypes, Model } from 'sequelize';

const app = express();
app.use(express.json());

// Sequelize types
interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  quantity: number
  description: string; 
}

interface ProductModel extends Model<ProductAttributes> {
  createdAt?: Date;
  updatedAt?: Date;
}

// Sequelize init
const sequelize = new Sequelize<ProductModel>('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// Product model
class Product extends Model<ProductAttributes, ProductModel> 
  implements ProductAttributes {
  
  public id!: number; // id is auto-generated
  public name!: string;
  public price!: number; 
  public quantity!: number; 
  public description!: string;
  
  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    description: DataTypes.TEXT
  },
  {
    sequelize,
    modelName: 'product'
  }
);

// CRUD routes

// CREATE (Create a resource.)
app.post('/products', async (req: Request, res: Response) => {
  const { name,price ,quantity ,description } = req.body;
  const product = await Product.create({ name,price ,quantity, description });
  return res.json(product);
});

// READ  
app.get('/products', async (req: Request, res: Response) => {
  const products = await Product.findAll();
  return res.json(products); 
});

//List resources with basic filters. (filter by price)
app.get('/products', async (req: Request, res: Response) => {

    const { minPrice, maxPrice } = req.query;
  
    const where: any = {};
  
    if (minPrice) {
      where.price = {
        ...where.price,
        [Op.gte]: parseInt(minPrice as string)
      };
    }
  
    if (maxPrice) {
      where.price = {
        ...where.price,  
        [Op.lte]: parseInt(maxPrice as string)
      };
    }
  
    const products = await Product.findAll({
      where    
    });
  
    return res.json(products);
  
  });



// READ one (Get details of a resource.)
app.get('/products/:id', async (req: Request, res: Response) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).send('Product not found');
  }
  return res.json(product);
});

// UPDATE (Update resource details.)
app.put('/products/:id', async (req: Request, res: Response) => {
  const { name, price, quantity, description } = req.body;  
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).send('Product not found');
  }
  product.name = name;
  product.price = price;
  product.quantity = quantity;
  product.description = description;
  await product.save();
  return res.sendStatus(204);
}); 

// DELETE (Delete a resource.)
app.delete('/products/:id', async (req: Request, res: Response) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).send('Product not found');
  }
  await product.destroy();
  return res.sendStatus(204); 
});

// Sync & Start server
sequelize.sync().then(() => {
  app.listen(8080, () => {
    console.log('Server started on port 8080');
  });
});