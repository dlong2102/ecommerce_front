import styled from "styled-components";
import {ButtonStyle} from "@/components/Button";
import {primary} from "@/lib/colors";
import {CartContext} from "@/components/CartContext";
import {useContext, useEffect, useRef, useState} from "react";
import FlyingButtonOriginal from 'react-flying-item'

const FlyingButtonWrapper = styled.div`
  button{
    ${ButtonStyle};  
    ${props => props.main ? `
      background-color: ${primary};
      color:white;
    ` : `
      background-color: transparent;
      border: 1px solid ${primary};
      color:${primary};
    `}
    ${props => props.white && `
      background-color: white;
      border: 1px solid white;
      font-weight:500;
    `}
  }
`;

export default function FlyingButton(props) {
  const {addProduct} = useContext(CartContext);
  return (   
      <FlyingButtonWrapper
      white={props.white} 
      main={props.main}
      onClick={() => addProduct(props._id)}>
            <FlyingButtonOriginal {...props}
                targetTop={'5%'}
                flyingItemStyling={{
                    width:'auto',
                    height:'auto',
                    maxWidth:'60px',
                    maxHeight:'60px',
                    borderRadius:0,
                }}
                targetLeft={'95%'}/>     
      </FlyingButtonWrapper>   
  );
}
