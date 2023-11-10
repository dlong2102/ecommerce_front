import styled from "styled-components";
import Center from "./Center";
import ProductBox from "./ProductBox";

const ProductGird = styled.div`
    display: grid;
    grid-template-columns:  1fr 1fr 1fr 1fr;
    gap: 20px;
    padding-top: 30px;
`;

export default function NewProducts({ products }) {
    return (
        <Center>
            <ProductGird>
                {products?.length > 0 && products.map(product => (
                    <ProductBox {...product} />
                ))}
            </ProductGird>
        </Center>
    );
}