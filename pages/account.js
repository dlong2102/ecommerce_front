import Header from "@/components/Header";
import Title from "@/components/Title";
import Center from "@/components/Center";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@/components/Button";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import { RevealWrapper } from "next-reveal";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 40px;
  margin: 40px 0;
  p {
    margin: 5px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishlistLoaded, setWishlistLoaded] = useState(true);
  const [orderLoaded, setOrderLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Orders');
  const [orders, setOrders] = useState([]);

  const [loaded, setLoaded] = useState(false);


  // Hàm đăng xuất
  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  // Hàm đăng nhập
  async function login() {
    await signIn('google');
  }

  // Hàm lưu địa chỉ
  function saveAddress() {
    const data = { name, email, city, streetAddress, postalCode, country };
    axios.put('/api/address', data);
  }

  useEffect(() => {
    if (!session) {
      return;
    }

    setAddressLoaded(false);
    setWishlistLoaded(false);
    setOrderLoaded(false);

    // Lấy thông tin địa chỉ từ API
    axios.get('/api/address').then(response => {
      setName(response.data.name);
      setEmail(response.data.email);
      setCity(response.data.city);
      setPostalCode(response.data.postalCode);
      setStreetAddress(response.data.streetAddress);
      setCountry(response.data.country);
      setAddressLoaded(true);
    });

    // Lấy danh sách sản phẩm yêu thích từ API
    axios.get('/api/wishlist').then(response => {
      setWishedProducts(response.data.map(wp => wp.product));
      setWishlistLoaded(true);
    });

    // Lấy danh sách đơn hàng từ API
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
      setOrderLoaded(true);
    });
  }, [session]);

  // Hàm xử lý khi sản phẩm bị xóa khỏi danh sách yêu thích
  function productRemovedFromWishlist(idToRemove) {
    setWishedProducts(products => {
      return [...products.filter(p => p._id.toString() !== idToRemove)];
    });
  }

  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <Tabs tabs={['Đơn hàng','Sản phẩm yêu thích']} 
                active={activeTab}
                onChange={setActiveTab}
                />
                {activeTab === 'Đơn hàng' &&(
                  <>
                  {!orderLoaded && (
                    <Spinner fullWidth={true}></Spinner>
                  )}
                  {orderLoaded && (
                      <div>
                        {orders.length === 0 && (
                          <p>Đăng nhập để thấy đơn hàng</p>
                        )}
                        {orders.length > 0 && orders.map(o => (
                          <SingleOrder {...o} />
                        ))}
                      </div>
                    )} 
                  </>
                )}
                {activeTab === 'Sản phẩm yêu thích' && (
                   <>
                   {!wishlistLoaded && (
                     <Spinner fullWidth={true}></Spinner>
                   )}
                   {wishlistLoaded && (
                     <>
                      <WishedProductsGrid>
                       { wishedProducts.length > 0 && wishedProducts.map(wp =>(
                           <ProductBox key={wp._id} {...wp} wished={true} 
                           onRemoveFromWishlist={productRemovedFromWishlist}
                            ></ProductBox>
                       ))}
                     </WishedProductsGrid>
                     {wishedProducts.length === 0 && (
                             <>
                               {session && (
                                 <p>Không có sản phẩm yêu thích nào</p>
                               )}
                               {!session && (
                                 <p>Đăng nhập để thấy sản phẩm yêu thích</p>
                               )}
                             </>
                           )}
                     </>    
                   )}
                   </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
          <div>
            <RevealWrapper delay={100}>
            <WhiteBox>
                <h2>{session ? 'Chi tiết tài khoản' : 'Đăng nhập'}</h2>
                {/* Hiển thị Spinner khi đang tải dữ liệu */}
                {!addressLoaded && <Spinner fullWidth={true} />}

                {/* Hiển thị thông tin khi đã tải dữ liệu */}
                {addressLoaded && session && (
                  <>
                    {/* Input và label cho tên, email, thành phố, mã bưu điện, địa chỉ và quốc gia */}
                    <Input
                      type="text"
                      placeholder="Tên"
                      value={name}
                      name="name"
                      onChange={(ev) => setName(ev.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Email"
                      value={email}
                      name="email"
                      onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <CityHolder>
                      <Input
                        type="text"
                        placeholder="Thành phố"
                        value={city}
                        name="city"
                        onChange={(ev) => setCity(ev.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Mã bưu điện"
                        value={postalCode}
                        name="postalCode"
                        onChange={(ev) => setPostalCode(ev.target.value)}
                      />
                    </CityHolder>
                    <Input
                      type="text"
                      placeholder="Địa chỉ"
                      value={streetAddress}
                      name="streetAddress"
                      onChange={(ev) => setStreetAddress(ev.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Quốc gia"
                      value={country}
                      name="country"
                      onChange={(ev) => setCountry(ev.target.value)}
                    />
                    {/* Button để lưu địa chỉ */}
                    <Button black block onClick={saveAddress}>
                      Lưu
                    </Button>
                    <hr />
                  </>
                )}

                {/* Button đăng xuất hoặc đăng nhập */}
                {session && <Button primary onClick={logout}>Đăng xuất</Button>}
                {!session && <Button primary onClick={login}>Đăng nhập cùng Goole</Button>}
              </WhiteBox>

            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
