import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart}) => {
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="270"
        image={product.image}
        alt={product.category}
      /> 
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h5">
            <b>${product.cost}</b>
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>
      <CardActions>
        <Button 
        className="button" 
        variant="contained" 
        startIcon={<AddShoppingCartOutlined />} 
        fullWidth size="medium"
        onClick = {handleAddToCart}
        >
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
