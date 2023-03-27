import React, { useState } from 'react';
import { Image, makeStyles, Button, Text, shorthands } from "@fluentui/react-components";
import { Link } from "react-router-dom";
import { Carousel } from '@trendyol-js/react-carousel';
import { ArrowLeftCircle, ArrowRightCircle } from 'react-feather';

const useStyles = makeStyles({
    arrows:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyItems: "center"
},
text: {
  ...shorthands.overflow("hidden"),
  width: "100px",
  display: "block",
},
  item:{
    display: "flex",
    width: "105px",
    flexDirection: "column",
    alignItems: "center",
    justifyItems: "center",
    
  },
  card:{
    display: "flex",
    justifyContent: "center",
    width: '115px'
  }
})
export default function Modules(props: any) {
    const Styles = useStyles();

    return (
        <Carousel className={Styles.arrows}
        leftArrow={<ArrowLeftCircle size={25} />}
        rightArrow={<ArrowRightCircle size={25} />}
        show={4} slide={1}  swiping={true}>
            {props.data.modules.map((module: any)=>
            <div className={Styles.card} key={module.id}>
            <Button className={Styles.item} appearance="transparent">
            <Image
            shape="rounded"
            src={module.img}
            height={100}
            width={100}
          />
          <Text truncate wrap={false} className={Styles.text}>{module.title}</Text>
          </Button>
          </div>
            )}
    </Carousel>
      );
}