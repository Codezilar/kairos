import { Container } from '@/components/Contaner'
import { ForYou } from '@/components/ForYou'
import { Grid } from '@/components/Grid'
import { Hero } from '@/components/Hero'
import { AppleCardsCarouselDemo } from '@/components/ShowCase'
import React from 'react'

const page = () => {
  return (
    <>
      <Hero />
      <AppleCardsCarouselDemo />
      
      {/* Default shows Fashion posts */}
      <Container categoryName="Construction Equipment & Machinery" />
      <Container categoryName="Cars & Automotive Vehicles" />
      <Container categoryName="Bicycles & Cycling Gear" />
      <Container categoryName="Solar Panels & Solar Energy Solutions" />
      <Container categoryName="Digital Electronic Devices | Smartphones, Tablets, Gadgets & More" />
      <Container categoryName="Gym Equipment & Fitness Gear | Home & Commercial" />
      <Container categoryName="Metal Work Tools & Equipment | Quality Metalworking Supplies" />
      <Container categoryName="Electrical Tools & Equipment | Professional & DIY Use" />
      <Container categoryName="Woodwork Tools & Equipment | Quality Woodworking Supplies" />
      
      <ForYou />
      {/* <Grid /> */}
    </>
  )
}

export default page