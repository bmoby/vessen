import styles from "./skeleton.module.css";

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  return <span className={`${styles.skeleton} ${className ?? ""}`} />;
}
