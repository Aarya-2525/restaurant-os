import MenuItem from "./MenuItem";

export default function MenuCategory({ category, onAdd }) {
  return (
    <section className="menu-category">
      <h2>{category.name}</h2>

      <div>
        {category.items.map(item => (
          <MenuItem
            key={item.id}
            item={item}
            onAdd={onAdd}
          />
        ))}
      </div>
    </section>
  );
}
