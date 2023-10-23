import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: "products" })
export class Product {

  @ApiProperty({
    example: "cdde3ar3-3234-234234-cDse5",
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: "Teslo - T-shirt ",
    description: 'Product Title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price'
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: "Descripcion de prueba",
    description: 'Product description',
    uniqueItems: null
  })
  @Column('text', {
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: "t_shirt_teslo",
    description: 'Product slug',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ["M", "XL"],
    description: 'Product sizes',
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: "women",
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];
  
  // @Column()
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product, 
    { cascade: true, eager: true }
    )
  images?: ProductImage[]

  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
  user: User

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title
    } 

    this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '');
  }
}
