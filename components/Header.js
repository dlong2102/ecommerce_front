import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { CartContext } from "./CartContext";
import { useContext, useState } from "react";
import BarsIcon from "@/components/icons/Bars";
import SearchIcon from "./icons/SearchIcon";


const StyleHeader = styled.header`
    background-color: #222;
    positon:sticky;
    top:0;
    z-index:10;
`;
const Logo = styled(Link)`
    color:#fff;
    text-decoration:none;
    position: relative;
    z-index: 3;
    font-weight: bold;
    text-align: center;
`;
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`;
const StyledNav = styled.nav`
    ${props => props.mobileNavActive ? `
    display: block;
    ` : `
    display: none;
    `}
    gap: 15px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: #222;
    @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
    }
`;
const NavLink = styled(Link)`
    display: block;
    color:#aaa;
    text-decoration:none;
    padding: 10px 0;
    min-width:30px;
    svg{
        height:20px;
      }
    @media screen and (min-width: 768px) {
    padding:0;
    }
`;
const NavButton = styled.button`
   background-color: transparent;
   width: 30px;
   height: 30px;
   border:0;
   color: white;
   cursor: pointer;
   position: relative;
   z-index: 3;
   @media screen and (min-width: 768px) {
   display: none;
  }
`;
const SideIcons = styled.div`
  display: flex;
  align-items: center;
  a{
    display:inline-block;
    min-width:20px;
    color:white;
    svg{
      width:14px;
      height:14px;
    }
  }
`;
export default function Header() {
    const { cartProducts } = useContext(CartContext);
    const [mobileNavActive, setMobileNavActive] = useState(false);
    return (
        <StyleHeader>
            <Center>
                <Wrapper>
                    <Logo href={'/'}>4TL<br />Ecommerce Store</Logo>
                    <StyledNav mobileNavActive={mobileNavActive}>
                        <NavLink href={'/'}>Trang chủ</NavLink>
                        <NavLink href={'/products'}>Tất cả sản phẩm</NavLink>
                        <NavLink href={'/categories'}>Danh mục</NavLink>
                        <NavLink href={'/account'}>Tài khoản</NavLink>
                        <NavLink href={'/cart'}> Giỏ hàng ({cartProducts.length})</NavLink>
                    </StyledNav>
                    <SideIcons>
                        <Link href={'/search'}><SearchIcon /></Link>
                        <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
                            <BarsIcon />
                        </NavButton>
                    </SideIcons>

                </Wrapper>
            </Center>
        </StyleHeader>

    );
}