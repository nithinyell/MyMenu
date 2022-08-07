import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';

const images = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQc6hKsCbd8aSL0RXIkzA0DVjb3ThlvkSVNQ&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Tcixgt0wQ1J8svx8zlXKSAnmQaS1mD2D6w&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw_VsLmNSt-jMq0Ta7YlTj5BuCmB5CDag2Yg&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8yTIjWX8FBa4dd2XbL8Px7JjGVNa2Xk4R9Q&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNG5zh3c_MkvUrLb5bAX_7u_AvWQHCF2AtZw&usqp=CAU"];

function Promotions() {
  const slides = images.map((url) => (
    <Carousel.Slide key={url}>
      <Image src={url} />
    </Carousel.Slide>
  ));

  return (
    <Carousel sx={{ maxWidth: 300 }} mx="auto">
      {slides}
    </Carousel>
  );
}

export default Promotions;