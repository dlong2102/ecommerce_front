import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "./icons/CartIcon";

const Bg = styled.div`
    background-color: #222;
    color: #fff;
    padding: 50px 0;
`;
const Title = styled.h1`
    margin: 0;
    font-weight: normal;
    font-size: 3rem;
`;
const Desc = styled.p`
    color: #aaa;
    font-size: .8rem;
`;
const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 40px;
    img{
        max-width: 100%;
    }  
`;
const Column = styled.div`
    display: flex;
    align-items: center;
`;
const ButtonWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 25px;
`;

export default function Featured({ product }) {
    return (
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Column>
                        <div>
                            <Title>{product.title}</Title>
                            <Desc>{product.description}</Desc>
                            <ButtonWrapper>
                                <ButtonLink href={'/products/' + product._id} outline={1} white={1}>Xem thêm</ButtonLink>
                                <Button primary>
                                    <CartIcon />
                                    Thêm vào giỏ hàng
                                </Button>
                            </ButtonWrapper>
                        </div>
                    </Column>
                    <Column>
                        <img src="https://khanhdang-next-ecommerce.s3.amazonaws.com/1699603211610.webp" />
                    </Column>
                </ColumnsWrapper>
            </Center>
        </Bg>
    );
}