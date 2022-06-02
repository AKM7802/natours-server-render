export const displayMap=(locations)=>{
    
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWs3OTgzIiwiYSI6ImNsMGI5NTIzYjB1ejgzamxnNGRsemh6dW8ifQ.Mse7Swt-2aAEtAUnqGJusA';
    
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/ak7983/cl0di2h41000n15lh4nbjigy2', 
        scrollZoom:false //To disable scroll zooming
    }); 
    
    const bounds =new mapboxgl.LngLatBounds()
    
    locations.forEach(loc=>{
        //Create Marker
        const el=document.createElement('div');
        el.className='marker';

        //Add marker
        new mapboxgl.Marker({
            element:el,
            anchor:'bottom'
        }).setLngLat(loc.coordinates).addTo(map)

        //Add popup above marker    
        new mapboxgl.Popup({
            offset:30 //To specify distance from the marker
        }).setLngLat(loc.coordinates)
        .setHTML(`<p>DAY ${loc.day}: ${loc.description}</p>`)
        .addTo(map);


        //Extends map bounds to include current location
        bounds.extend(loc.coordinates)
    })
    
    map.fitBounds(bounds,{
        padding:{
            top:200,
            bottom:150,
            left:100,
            right:100
        }

    })

}




