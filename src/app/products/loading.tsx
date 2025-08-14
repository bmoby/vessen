import Header from "@/components/navbar/Header";
import Spinner from "@/components/shared/Spinner";
import styles from "@/components/sections/products.module.css";

export default function LoadingProducts() {
  return (
    <div className={styles.fullscreen}>
      <Spinner />
    </div>
  );
}
