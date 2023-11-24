import * as THREE from 'three'

// Matcaps
import matcapBeigeSource from './matcaps/beige.png'
import matcapBlackSource from './matcaps/black.png'
import matcapOrangeSource from './matcaps/orange.png'
import matcapRedSource from './matcaps/red.png'
import matcapWhiteSource from './matcaps/white.png'
import matcapGreenSource from './matcaps/green.png'
import matcapBrownSource from './matcaps/brown.png'
import matcapGraySource from './matcaps/gray.png'
import matcapEmeraldGreenSource from './matcaps/emeraldGreen.png'
import matcapPurpleSource from './matcaps/purple.png'
import matcapBlueSource from './matcaps/blue.png'
import matcapCopperSource from './matcaps/copper.png'
import matcapYellowSource from './matcaps/yellow.png'
import matcapMetalSource from './matcaps/metal.png'
import matcapGoldSource from './matcaps/gold.png'
import matcapPlasticWhiteSource from './matcaps/plasticWhite.png'
import airSource from './matcaps/smoke_06.png'
import bake from './matcaps/bake.png'
import Loader from './Utils/Loader'
import EventEmitter from './Utils/EventEmitter'
// @ts-ignore
import ahu from '/models/ahu.glb'
export default class Resources extends EventEmitter
{
    loader: Loader
    items: any
    
    constructor()
    { 

        super()
        this.loader = new Loader()
        this.items = {
            
        }

        this.loader.load([
            // Matcaps
            { name: 'matcapPlasticWhite', source: matcapPlasticWhiteSource, type: 'texture' },
            { name: 'matcapBeige', source: matcapBeigeSource, type: 'texture' },
            { name: 'matcapBlack', source: matcapBlackSource, type: 'texture' },
            { name: 'matcapOrange', source: matcapOrangeSource, type: 'texture' },
            { name: 'matcapRed', source: matcapRedSource, type: 'texture' },
            { name: 'matcapWhite', source: matcapWhiteSource, type: 'texture' },
            { name: 'matcapGreen', source: matcapGreenSource, type: 'texture' },
            { name: 'matcapBrown', source: matcapBrownSource, type: 'texture' },
            { name: 'matcapGray', source: matcapGraySource, type: 'texture' },
            { name: 'matcapEmeraldGreen', source: matcapEmeraldGreenSource, type: 'texture' },
            { name: 'matcapPurple', source: matcapPurpleSource, type: 'texture' },
            { name: 'matcapBlue', source: matcapBlueSource, type: 'texture' },
            { name: 'matcapYellow', source: matcapYellowSource, type: 'texture' },
            { name: 'matcapMetal', source: matcapMetalSource, type: 'texture' },
            { name: 'matcapGold', source: matcapGoldSource, type: 'texture' },
            { name: 'matcapCopper', source: matcapCopperSource, type: 'texture' },
            { name: 'air', source: airSource, type: 'texture' },
            { name: 'bake', source: bake, type: 'texture' },
            //{ name: 'ahu', source: ahu, type: 'glb' },
        
        ])

        this.loader.on('fileEnd', (_resource:any, _data:any) =>
        {
            this.items[_resource.name] = _data 
            // Texture
            if(_resource.type === 'texture')
            {
                const texture = new THREE.Texture(_data)
               // texture.encoding = THREE.LinearEncoding
                texture.needsUpdate = true

                this.items[`${_resource.name}Texture`] = texture
            }

            // Trigger progress
           this.trigger('progress', [this.loader.loaded / this.loader.toLoad])
        })

        this.loader.on('end', () =>
        {
            // Trigger ready
           this.trigger('ready')
        })
    }
}