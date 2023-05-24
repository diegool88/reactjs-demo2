import "./styles.css";
import { useState } from "react";

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ filterText, filterPrice, inStockOnly, products }) {
  const rows = [];
  let lastCategory = null;

  products
    .filter((product) => (inStockOnly ? product.stocked === true : true)) // Validate in stock
    .filter((product) =>
      filterText.length > 0
        ? product.name.toLowerCase().indexOf(filterText.toLowerCase()) >= 0
        : true
    ) // Validate search filter
    .filter((product) =>
      filterPrice
        ? parseInt(product.price.replace("$", ""), 0) <= filterPrice
        : true
    ) // Filter by max price
    .forEach((product) => {
      if (product.category !== lastCategory) {
        rows.push(
          <ProductCategoryRow
            category={product.category}
            key={product.category}
          />
        );
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  filterPrice,
  inStockOnly,
  onFilterTextChange,
  onFilterPriceChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <br />
      <input
        type="number"
        placeholder="Max price..."
        value={filterPrice}
        onChange={(e) => onFilterPriceChange(e.target.value)}
      />
      <br />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />{" "}
        Only show products in stock
      </label>
      <br />
    </form>
  );
}

function FilterableProductTable({ products }) {
  const maxPrice = useState(
    Math.max(
      ...products.map((product) => parseInt(product.price.replace("$", ""), 0))
    )
  );
  const [filterText, setFilterText] = useState("");
  const [filterPrice, setFilterPrice] = useState(maxPrice);
  const [inStockOnly, setInStockOnly] = useState(false);

  console.log(filterPrice);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        filterPrice={filterPrice}
        onFilterTextChange={setFilterText}
        onFilterPriceChange={setFilterPrice}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        filterText={filterText}
        filterPrice={filterPrice}
        inStockOnly={inStockOnly}
        products={products}
      />
    </div>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
