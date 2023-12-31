import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 30px 0;
  h1{
    font-size:1.5em;
    margin-right: 20px;
  }
`;
const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;
const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  gap: 5px;
  color:#444;
  select{
    background-color:transparent;
    border:0;
    font-size:inherit;
    color:#444;
  }
`;
export default function CategoriesPage({ category, subCategories, products: originalProducts }) {
  const defaultSorting = '_id-desc';
  const [products, setProducts] = useState(originalProducts);
  const defaultFilterValues = category.properties.map(p => ({ name: p.name, value: 'all' }));
  const [filtersValues, setFiltersValues] = useState(defaultFilterValues);
  const [sort, setSort] = useState(defaultSorting);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

  function handleFilterChange(filterName, filterValue) {
    setFiltersValues(prev => {
      return prev.map(p => ({
        name: p.name,
        value: p.name === filterName ? filterValue : p.value,
      }));
    });
    setFiltersChanged(true);
  }
  useEffect(() => {
    if (!filtersChanged) {
      return;
    }
    const catIds = [category._id, ...(subCategories?.map(c => c._id))];
    setLoadingProducts(true);
    const params = new URLSearchParams;
    params.set('categories', catIds.join(','));
    params.set('sort', sort);
    filtersValues.forEach(f => {
      if (f.value !== 'all') {
        params.set(f.name, f.value);
      }
    });
    const url = `/api/products?` + params.toString();
    axios.get(url).then(res => {
      setProducts(res.data);
      setTimeout(() => {
        setLoadingProducts(false);
      }, 1000);

    })
  }, [filtersValues, sort, filtersChanged, category._id, subCategories]);
  return (
    <>
      <Header />
      <Center>
        <CategoryHeader>
          <h1 className="">{category.name}</h1>
          <FiltersWrapper>
            {category.properties.map(prop => (
              <Filter key={prop.name}>
                <span>{prop.name}</span>
                <select
                  onChange={ev => handleFilterChange(prop.name, ev.target.value)}
                  value={filtersValues.find(f => f.name === prop.name).value}>
                  <option value="all">All</option>
                  {prop.values.map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}</select>
              </Filter>
            ))}
            <Filter>
              <select
                value={sort} onChange={ev => {
                  setSort(ev.target.value);
                  setFiltersChanged(true);
                }}>
                <option value="price-asc">Price, lowest first</option>
                <option value="price-desc">Price, highest first</option>
                <option value="_id-desc">newest first</option>
                <option value="_id-asc">oldest first</option>
              </select>
            </Filter>
          </FiltersWrapper>

        </CategoryHeader>
        {loadingProducts && (
          <Spinner fullWidth />
        )}
        {!loadingProducts && (
          <div>
            {products.length > 0 && (
              <ProductsGrid products={products} />
            )}
            {products.length === 0 && (
              <div>Xin lỗi, sản phẩm không tồn tại</div>
            )}
          </div>

        )}

      </Center>

    </>
  );
}
export async function getServerSideProps(context) {
  const category = await Category.findById(context.query.id);
  const subCategories = await Category.find({ parent: category._id });
  const catIds = [category._id, ...subCategories.map(c => c._id)];
  const products = await Product.find({ category: catIds });
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
    }
  };
}