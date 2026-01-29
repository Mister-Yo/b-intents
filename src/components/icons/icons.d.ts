export type IconProps<T = {}> = {
  className?: string;
  color?: string;
} & T;

export type Icon<T = {}> = React.FC<IconProps<T>>;
