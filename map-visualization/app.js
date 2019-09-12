// create instance of p5
new p5();
var increment_size;


// canvas and grid info
/*----------------------------------------------------------*/
var CANVAS_HEIGHT = 800;
var CANVAS_WIDTH = 800;
// var CANVAS_HEIGHT = 1000;
// var CANVAS_WIDTH = 1000;


const GRID_PROCESSING_VALUE = 2;
// contains grid of image processed at an initial chunk value
var grid;

var draw_grid = true;

// colors
const COLOR_BLACK = color(0, 0, 0);
const COLOR_GRAY = color(242, 242, 242);
const COLOR_WHITE = color(255, 255, 255);
const COLOR_BLUE = color(135, 206, 235, 100);

//selection square info
const TRANSPERENCY = 255;
const SELECTION_COLOR = color(0, 0, 100, 50);
const SELECTION_COLOR_START = color(0, 100, 0, TRANSPERENCY);
const SELECTION_COLOR_END = color( 100, 0, 0, TRANSPERENCY);

var selection_modes = ['select_start_node', 'select_end_node', 'select_normal_node'];
var node_types = [ 'start', 'end', 'normal' ];
var current_selection_index = 0;


// path finding variables
var start_node = null;
var end_node = null;

// map generation variables
/*----------------------------------------------------------*/
// general colors
const COLOR_ROAD = color(246, 246, 234);
const COLOR_GRASS = color(194, 221, 168);
const COLOR_BUILDING = color(255, 212,86);
const COLOR_LETTER = color(107, 92, 113 );
const COLOR_PURPLE = color(0, 91, 156);

// pixel liniency
const PIXEL_VALUE_LINIENCY = 5;
const LETTER_PIXEL_VALUE_LINIENCY = 75;

// view matrix variables
var view_matrix = [];
var VIEW_VALUE = 1;
var map_height;
var map_width;
var changing_view = false;
var view_index_offset_x = 0;
var view_index_offset_y = 0;
const VIEW_STEP_VALUE = 5;
// changes queue
var updateQueue = new Array();
// shifts removes first element and returns it
// push adds element to end of array



$(document).ready( () => {
    console.log('Document is ready');
    // console.log(test_map_image['height']);
    Jimp.read('../assets/test-map.png')
    .then(image => {

        map_height  = image["bitmap"]["height"];
        map_width  = image["bitmap"]["width"];
        createGrid();
        createViewMatrix();
        document.getElementById( 'selection_mode' ).innerHTML = selection_modes[ current_selection_index ];

        // display current
    })
    .then( result => {
        // console.log(result);
    })
    .catch(err => {
        console.log(err);
        return 0;
    });




    document.getElementsByClassName("slider")[0].addEventListener("change", event => {

        // value used to change scaling of view
        VIEW_VALUE = Number(event["currentTarget"]["value"]);
        changing_view = true;
        createViewMatrix();
        // reset offsets
        view_index_offset_x = 0;
        view_index_offset_y = 0;
        draw_grid = true;
    }, false);
});


function setup() {
    createCanvas( CANVAS_HEIGHT, CANVAS_WIDTH);
    pixelDensity(1);
}
var test_map_image;
function preload() {

    // TODO: stalls time, if commented out application crashes, try using jquery to fix
    test_map_image = loadImage('../assets/test-map.png');

}


function createGrid()
{

    // calculate grid dimensions based on map dimensions and processing value
    var vertical_length = Math.floor( map_height / GRID_PROCESSING_VALUE );
    var horizontal_length = Math.floor( map_width / GRID_PROCESSING_VALUE);

    grid = new Array( vertical_length );

    for(var i=0; i < grid.length; i++)
    {
        grid[i] = new Array( horizontal_length );
    }

    for(var y=0; y < grid.length; y++)
    {
        for(var x=0; x < grid[y].length; x++)
        {
            grid[x][y] = new Cell(GRID_PROCESSING_VALUE*x, GRID_PROCESSING_VALUE*y, GRID_PROCESSING_VALUE);
        }
    }

    // processImage();
}

function processImage() {

    Jimp.read('../assets/test-map.png')
    .then(image => {

        // calculate chunking  based on map dimensions and processing value
        var horizontal_chunks = Math.floor( map_width / GRID_PROCESSING_VALUE );
        var vertical_chunks = Math.floor( map_height / GRID_PROCESSING_VALUE );

        var color_grid = new Array( vertical_chunks );


        for(var i=0; i < grid.length; i++)
        {
            color_grid[i] = new Array( horizontal_chunks );
        }


        // iterate over each chunk
        for(var y=0; y < vertical_chunks; y++)
        {
            for(var x=0; x < horizontal_chunks; x++)
            {
                var chunk_x_start_position = x * GRID_PROCESSING_VALUE;
                var chunk_y_start_position = y * GRID_PROCESSING_VALUE;
                var chunk_x_end_position = chunk_x_start_position + GRID_PROCESSING_VALUE;
                var chunk_y_end_position = chunk_y_start_position + GRID_PROCESSING_VALUE;

                for(var _y=chunk_y_start_position; _y < chunk_y_end_position; _y++)
                {
                    //process chunk
                    var pixel_array = new Array();
                    for(var _x=chunk_x_start_position; _x < chunk_x_end_position; _x++)
                    {
                        // add rgb pixel value to chunk pixel array
                        pixel_array.push( color(Jimp.intToRGBA(image.getPixelColor(_x,_y))["r"], Jimp.intToRGBA(image.getPixelColor(_x,_y))["g"], Jimp.intToRGBA(image.getPixelColor(_x,_y))["b"] ) );
                    }
                }

                var road_pixel_count = 0;
                var building_pixel_count = 0;
                var grass_pixel_count = 0;
                var letter_pixel_count = 0;

                for(i=0; i < pixel_array.length; i++)
                {
                    // increment pixel count based on preset colors with liniency
                    if( compareRGBColor( PIXEL_VALUE_LINIENCY, COLOR_ROAD["levels"][0], COLOR_ROAD["levels"][1], COLOR_ROAD["levels"][2], pixel_array[0]["levels"][0], pixel_array[0]["levels"][1], pixel_array[0]["levels"][2]) ) {
                        road_pixel_count++;
                    } else if( compareRGBColor( PIXEL_VALUE_LINIENCY, COLOR_GRASS["levels"][0], COLOR_GRASS["levels"][1], COLOR_GRASS["levels"][2], pixel_array[0]["levels"][0], pixel_array[0]["levels"][1], pixel_array[0]["levels"][2])  ) {
                        grass_pixel_count++;
                    } else if ( compareRGBColor( PIXEL_VALUE_LINIENCY, COLOR_BUILDING["levels"][0], COLOR_BUILDING["levels"][1], COLOR_BUILDING["levels"][2], pixel_array[0]["levels"][0], pixel_array[0]["levels"][1], pixel_array[0]["levels"][2]) )  {
                        building_pixel_count++;
                    } else if ( compareRGBColor( LETTER_PIXEL_VALUE_LINIENCY, COLOR_LETTER["levels"][0], COLOR_LETTER["levels"][1], COLOR_LETTER["levels"][2], pixel_array[0]["levels"][0], pixel_array[0]["levels"][1], pixel_array[0]["levels"][2]) )  {
                        letter_pixel_count++;
                    }

                }

                // determine prominent pixel color in chunk
                if(road_pixel_count > building_pixel_count && road_pixel_count > grass_pixel_count && road_pixel_count > letter_pixel_count) {
                    color_grid[x][y] = COLOR_ROAD;
                } else if(grass_pixel_count > road_pixel_count && grass_pixel_count > building_pixel_count && grass_pixel_count > letter_pixel_count) {
                    color_grid[x][y] = COLOR_GRASS;
                } else if ( building_pixel_count > road_pixel_count && building_pixel_count > grass_pixel_count && building_pixel_count > letter_pixel_count ) {
                    color_grid[x][y]  = COLOR_BUILDING;
                } else if ( letter_pixel_count > 0 ) {
                    color_grid[x][y] = COLOR_LETTER;
                } else {
                    color_grid[x][y]  = COLOR_ROAD;
                }


            }
        }

        // set cell type based prominent pixel color
        for(var y=0; y < color_grid.length; y++)
        {
            for(var x=0; x < color_grid[y].length; x++)
            {
                if(color_grid[x][y] == COLOR_ROAD) {
                    grid[x][y].set_type  = "road";
                } else if(color_grid[x][y] == COLOR_GRASS) {
                    grid[x][y].set_type  = "grass";
                } else if(color_grid[x][y] == COLOR_BUILDING) {
                    grid[x][y].set_type  = "building";
                } else if(color_grid[x][y] == COLOR_LETTER) {
                    grid[x][y].set_type  = "letter";
                }
            }
        }

    })
    .catch(err => {
        console.log(err);
        return 0;
    });
}

function compareRGBColor(pixel_liniency, preset_r, preset_g, preset_b, current_r, current_g, current_b) {
    // compares rbg values with pixel liniency
    if( ( current_r >=  ( preset_r - pixel_liniency) && current_r <=  ( preset_r + pixel_liniency) ) && ( current_g >=  ( preset_g - pixel_liniency) && current_g <=  ( preset_g + pixel_liniency) ) && ( current_b >=  ( preset_b - pixel_liniency) && current_b <=  ( preset_b + pixel_liniency) ) )  {
        return true;
    } else {
        return false;
    }
}

function createViewMatrix() {

    // calculate grid dimensions
    vertical_chunks = Math.floor( grid.length / VIEW_VALUE );
    horizontal_chunks = Math.floor( grid[0].length / VIEW_VALUE );
    // initialize grid
    view_matrix = new Array( vertical_chunks );
    for(var i=0; i < view_matrix.length; i++)
    {
        view_matrix[i] = new Array( horizontal_chunks );
    }

    // insert grid coordinate values
    for(var y=0; y < view_matrix.length; y++)
    {
        for(var x=0; x < view_matrix[y].length; x++)
        {
            view_matrix[x][y] = [ x, y ];
        }
    }


}

function drawGrid( current_grid )
{

    if (current_grid != null)
    {
        var view_matrix_increment_value = Math.floor( CANVAS_WIDTH / current_grid.length )
        for(var y=0; y < current_grid.length; y++)
        {
            for(var x=0; x < current_grid[y].length; x++)
            {

                if(current_grid[x][y] != null) {

                    // check cell type
                    if ( grid[ current_grid[x][y][0] + view_index_offset_x ][ current_grid[x][y][1] + view_index_offset_y ] != null )
                    {

                        // if ( grid[ current_grid[x][y][0] + view_index_offset_x ][ current_grid[x][y][1] + view_index_offset_y ].get_type == 'road') {
                        //     fill( COLOR_ROAD );
                        // } else if ( grid[ current_grid[x][y][0] + view_index_offset_x ][ current_grid[x][y][1] + view_index_offset_y ].get_type == 'grass') {
                        //     fill( COLOR_GRASS );
                        // } else if ( grid[ current_grid[x][y][0] + view_index_offset_x ][ current_grid[x][y][1] + view_index_offset_y ].get_type == 'building') {
                        //     fill( COLOR_BUILDING );
                        // } else if ( grid[ current_grid[x][y][0] + view_index_offset_x ][ current_grid[x][y][1] + view_index_offset_y ].get_type == 'letter') {
                        //     fill( COLOR_LETTER );
                        // }

                        // //draw cell
                        fill ( COLOR_WHITE )
                        square(view_matrix_increment_value*x, view_matrix_increment_value*y, view_matrix_increment_value);


                        // draw selection square
                        var current_node_type = grid[ current_grid[x][y][0] + view_index_offset_x ][ current_grid[x][y][1] + view_index_offset_y ].get_node_type;
                        if ( current_node_type != null ) {
                            if ( current_node_type == 'normal' ) {
                                fill( SELECTION_COLOR );
                            } else if ( current_node_type == 'start' ) {
                                fill( SELECTION_COLOR_START );
                            } else if( current_node_type == 'end' ) {
                                fill( SELECTION_COLOR_END );
                            }
                            square(view_matrix_increment_value*x, view_matrix_increment_value*y, view_matrix_increment_value);
                        }

                        //  // draw selection square
                        //  if ( grid[ current_grid[x][y][0] + view_index_offset_x ][ current_grid[x][y][1] + view_index_offset_y ].get_visited ) {
                        //     fill( SELECTION_COLOR );
                        //     square(view_matrix_increment_value*x, view_matrix_increment_value*y, view_matrix_increment_value);
                        // }

                    }

                    //draw selection square
                    // if ( grid[x][y].get_visited ) {
                    //     fill( SELECTION_COLOR );
                    //     square(view_matrix_increment_value*x, view_matrix_increment_value*y, view_matrix_increment_value);
                    // }
                }

            }
        }


    } else {
        console.log('no view matrix');
    }


}


function mousePressed() {
    // calculate coordinates of chunk selected, accounts for view offset
    var view_matrix_increment_value = Math.floor( CANVAS_WIDTH / view_matrix.length )
    var x_selected = Math.floor ( mouseX / view_matrix_increment_value ) + view_index_offset_x;
    var y_selected = Math.floor ( mouseY / view_matrix_increment_value ) + view_index_offset_y;
    console.log('x: %d y: %d', x_selected, y_selected);
    console.log('start_node');
    console.log(start_node);

 // check if position selected is a valid grid position
 if( ( ( x_selected >= 0 ) && ( x_selected <= grid[0].length-1 ) ) && ( ( y_selected >=0 )  && ( y_selected <= grid.length - 1 ) ) ) {
        // check if selection is bounds of view matrix
        // if( ( ( x_selected >= 0 ) && ( x_selected <= view_matrix[0].length-1 ) ) && ( ( y_selected >=0 )  && ( y_selected <= view_matrix.length - 1 ) ) ) {
            // check if cell is not null

            // deal with out of view selection when updated screen based on screen
            if ( grid[ x_selected ][ y_selected ] != null ) {
                updateQueue.push( [ x_selected, y_selected ] );
                console.log(updateQueue);
            } else {
                console.log( 'cell is not defined' );
            }
        // }

    } else {
        console.log( 'selection is out of bounds');
    }


}

function keyPressed() {
    if( keyCode === ENTER ) {
        console.log( grid );
        console.log( view_matrix );
    }

    // view matrix control
    //----------------------------------------------------------------------------------------------------------------
    // move -Y direction
    if ( keyCode ===  87 ) {
        // console.log('pressed w');
        for( var i=0; i< VIEW_STEP_VALUE; i++) {
            // checking vertical grind bounds
            if ( !( view_index_offset_y - 1 < 0 ) ) {
                view_index_offset_y -= 1;
                // drawGrid( view_matrix );
                draw_grid = true;
            }
        }
        // console.log( view_index_offset_y );
    }

    // move on +Y direction
    if ( keyCode === 83 ) {
        // console.log('pressed s');
        for( var i=0; i< VIEW_STEP_VALUE; i++) {
            //checking vertical grid bounds
            if ( ( ( view_matrix.length - 1 ) + view_index_offset_y + 1 < grid.length ) && ( grid[ 0 ][ ( view_matrix.length - 1 ) + view_index_offset_y + 1] != null )){
                view_index_offset_y += 1;
                // drawGrid( view_matrix );
                draw_grid = true;
            }
        }
        // console.log( view_index_offset_y );
    }

    // move on -X direction
    if ( keyCode === 65 ) {
        // console.log('pressed a');
        for( var i=0; i< VIEW_STEP_VALUE; i++) {
            // checking horizontal grid bounds
            if ( !( view_index_offset_x - 1 < 0 ) ) {
                view_index_offset_x -= 1;
                // drawGrid( view_matrix );
                draw_grid = true;
            }
        }
        // console.log( view_index_offset_x );
    }

    // move on +X direction
    if ( keyCode === 68 ) {
        // console.log('pressed d');
        for( var i=0; i< VIEW_STEP_VALUE; i++) {
             // checking horizontal grid bounds
            if ( ( ( view_matrix[0].length - 1 ) + view_index_offset_x + 1 < grid[0].length ) && ( grid[ ( view_matrix[0].length - 1 ) + view_index_offset_x + 1 ][ 0 ] != null )){
                view_index_offset_x += 1;
                // drawGrid( view_matrix );
                draw_grid = true;
            }
        }
        // console.log( view_index_offset_x );
    }

}

function mouseWheel(){

    // selection mode control
    //----------------------------------------------------------------------------------------------------------------
    // mouse scroll up
    if ( event.delta < 0 ) {
        // check array upper bounds,
        if ( ( current_selection_index + 1) <= ( selection_modes.length - 1 ) ) {
            current_selection_index += 1;
        } else {
            current_selection_index = 0;
        }
        console.log( current_selection_index );
        document.getElementById( 'selection_mode' ).innerHTML = selection_modes[ current_selection_index ];
    // mouse scroll down
    } else {
        if ( ( current_selection_index - 1) >=  0 ) {
            current_selection_index -= 1;
        } else {
            current_selection_index = selection_modes.length - 1;
        }
        console.log( current_selection_index );
        document.getElementById( 'selection_mode' ).innerHTML = selection_modes[ current_selection_index ];

    }
    console.log( event.delta);
    return false;
}

function update_selection_cells() {
    var cell_size = Math.floor( CANVAS_WIDTH / view_matrix.length )
    while ( updateQueue.length > 0 ) {
        console.log( 'cell updated');
        // console.log( updateQueue.shift() );
        cell_position = updateQueue.shift();


        var current_selected_type = grid[ cell_position[0] ][ cell_position[1] ].get_node_type;
        if ( selection_modes[ current_selection_index ] == 'select_start_node' ) {
            if ( start_node == null ) {
                start_node = [ cell_position[0], cell_position[1] ];
            } else {
                grid[ start_node[0] ][ start_node[1] ].set_node_type = null;
                start_node = [ cell_position[0], cell_position[1] ];
            }
            grid[ cell_position[0] ][ cell_position[1] ].set_node_type = node_types[ current_selection_index ];
        }

        // selecting end node
        if ( selection_modes[ current_selection_index ] == 'select_end_node' ) {
            if ( end_node == null ) {
                end_node = [ cell_position[0], cell_position[1] ];
            } else {
                grid[ end_node[0] ][ end_node[1] ].set_node_type = null;
                end_node = [ cell_position[0], cell_position[1] ];
            }
            grid[ cell_position[0] ][ cell_position[1] ].set_node_type = node_types[ current_selection_index ];
        }

    }
    // update changes at end
    draw_grid = true;
}

function draw() {
    stroke( COLOR_BLUE );

    if ( draw_grid ) {
        background( COLOR_WHITE );
        drawGrid( view_matrix );
        draw_grid = false;
        console.log('drawing map');
    }

    if ( updateQueue.length != 0 ) {
        update_selection_cells();
    }


}