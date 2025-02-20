import Image from 'next/image';

interface IProps {
    width?: number;
    height?: number;
}

export const GosuslugiIcon = ({ width = 25, height = 25 }: IProps) => (
    <Image src="/icons/gosuslugi-icon.svg" width={width} height={height} alt="Госуслуги"/>
);
