












<figure>
	<img src='/img/components/orthographic-earth/orthographic-earth-1500x750.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

##### Premium DOM Component

# Orthographic Earth

## A world of possibilities


<address>
<img src='/img/48x48/rwtools.png' /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2021-01-08>Jan 8, 2021</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td><p>The <span class=product>Orthographic Earth</span> DOM component renders an interactive map of Earth where an entire hemisphere is visible. Its viewing angle can be rotated and tilted by the user to show Earth from any point of reference.</p> <p>Data can be added to the map using network-friendly <i>quantized</i> topoJSON layers. Data points can be linked to external databases to allow users to explore spatial-based thematic patterns.</p> <p>Data layers can be styled using a declarative language for visual style sheets.</p> </td></tr>
</table>

### Background

All global maps suffer from distortion. This is because maps are a 2-dimensional
projection of a 3-dimensional Earth. Attempts to display the entire world on a
single rectangular canvas suffer more acutely than maps that are limited to just
a portion of Earth at a time.

As an example, the Mercator projection exaggerates the size of the polar
regions. This makes Canada, Greenland, and Russia appear much large than Africa,
and turns Antarctica into an unrecognizable shape.

Another alternative — commonly used in thematic maps — is the equi-rectangular
projection. It  has less exaggerated areas than the Mercator projection, but
still suffers because it plots each latitude without regard for the shorter
longitudinal distances of the polar regions.

In contrast, the *orthographic projection* has faithful areas and angles near the
point of perspective, with distortion occuring gradually, and only being
noticable near the horizons. The primary drawback with orthographic projections
in the past has been the fact that they only represent one-half of the world.

The <span>Orthographic Earth</span> DOM component provides an
excellent alternative for cartographers who want to tell thematic stories on a
global scale.

The Orthographic Earth component has these features:

   * The component can be used within any HTML document.
   * The drawing can be resized to fit the device's screen size, allowing it to be
      used on both small cell phones and large mega-pixel monitors.
   * The component is self-contained, which allows for the possibility of having two
      or more Earth drawings appear side-by-side on the same page.
   * The user interface supports both touchscreen and mouse gestures for scaling,
      translation, rotation and tilt.
   * Users can locate and identify features by pointing to them.
   * Webmasters can use the component's event-based interface to monitor user
      interactions, allowing synchronization with other parts of the HTML page.
   * Features can be styled using a declarative visual stylesheet language.

Data layers can use sources with any of these supported formats. See <a href='https://hub.readwritetools.com/libs/gcsio.blue'>GCS I/O</a>
for more about these formats. See <a href='https://towardsdatascience.com/2022-051-better-compression-of-gis-features-9f38a540bda5'>Better Compression of GIS Features</a>
for optimization techniques.

   * gfe - Geographic Feature Encoding
   * ice - Indexed Coordinate Encoding
   * tae - Topological Arc Encoding
   * gfebin - Geographic Feature Encoding binary
   * icebin - Indexed Coordinate Encoding binary
   * taebin - Topological Arc Encoding binary
   * geojson - <a href='https://datatracker.ietf.org/doc/html/rfc7946'>RFC 7946</a>
   * topojson - (<a href='https://github.com/topojson/topojson-specification'>Specification</a>
)

#### In the wild

To see examples of this component in use, visit any of these:


<table>
	<tr><td><a href='https://full.earth'>full.earth</a></td><td>Polar views the world</td></tr>
	<tr><td><a href='https://timezone.earth'>timezone.earth</a></td><td>Interactive map of world time</td></tr>
	<tr><td><a href='https://simply.earth'>simply.earth</a></td><td>Political geography of the world</td></tr>
</table>

### Installation


<details>
	<summary>Prerequisites</summary>
	<p>The <span class=product>rwt-orthographic-earth</span> DOM component works in any browser that supports modern W3C standards and the W3C Web Platform Incubator Community Group's <a href='https://wicg.github.io/import-maps/'>importmap</a> proposal. Chrome provides a good implementation of the <span>importmap</span> proposal, other browsers can use Guy Bedford's polyfill  <a href='https://www.npmjs.com/package/es-module-shims'>es-module-shims</a>.</p>
	<pre lang=bash>
npm install es-module-shims<br />	</pre>
	<p>The <span class=product>rwt-orthographic-earth</span> DOM component has three additional dependencies, also written by Read Write Tools:</p>
	<dl>
		<dt><a href='https://www.npmjs.com/package/rwt-dockable-panels'>rwt-dockable-panels</a></dt>
		<dd>Dockable Panels DOM component.</dd>
		<dt><a href='https://www.npmjs.com/package/softlib'>softlib</a></dt>
		<dd>Runtime code safety and sanity checking.</dd>
		<dt><a href='https://www.npmjs.com/package/gcsio'>GCS I/O</a></dt>
		<dd>Geographic Coordinate System I/O Library.</dd>
	</dl>
</details>


<details>
	<summary>Download using NPM</summary>
	<p>Install the component and dependencies with these commands:</p>
	<pre lang=bash>
npm install rwt-orthographic-earth<br />npm install rwt-dockable-panels<br />npm install softlib<br />npm install gcsio<br />	</pre>
	<p style='font-size:0.9em'>Important note: This DOM component uses Node.js and NPM and <code>package.json</code> as a convenient <i>distribution and installation</i> mechanism. The DOM component itself does not need them.</p>
</details>


<details>
	<summary>Download using Github</summary>
	<p>If you prefer using Github, follow these steps:</p>
	<ul>
		<li>Create a <code>node_modules</code> directory in the root of your web project.</li>
		<li>Clone the required repos into it using these commands:</li>
		<pre lang=bash>
git clone https://github.com/readwritetools/rwt-orthographic-earth.git<br />git clone https://github.com/readwritetools/rwt-dockable-panels.git<br />git clone https://github.com/readwritetools/softlib.git<br />git clone https://github.com/readwritetools/gcsio.git<br />		</pre>
	</ul>
</details>

### Using the component

After installation, you need to add three things to your HTML page to make use
of it:

   1. Add an `importmap` and a `script` tag to load the component and its dependencies:
```html
<script src='/node_modules/es-module-shims/dist/es-module-shims.js' async></script>
<script type=importmap-shim>
{
    "imports": {
        "gcsio/": "/node_modules/gcsio/",
        "softlib/": "/node_modules/softlib/",
        "rwt-dockable-panels/": "/node_modules/rwt-dockable-panels/"
    }
}            
</script>
<script src='/node_modules/rwt-orthographic-earth/rwt-orthographic-earth.js' type=module-shim></script>             
```

   2. Add the component tag somewhere on the page.

      * For scripting purposes, apply an `id` attribute.
      * For WAI-ARIA accessibility apply a `role=contentinfo` attribute.
```html
<rwt-orthographic-earth id=earth1 role=contentinfo></rwt-orthographic-earth>
```

   3. Listen for the component to be fully loaded before programmatically configuring
      its layers, stylesheets, and initial settings. Here's an example:
```html
<script type=module-shim>
     var earth1 = document.getElementById('earth1');
     var promise = earth1.waitOnLoading();
     promise.then(() => {
         addLayers(earth1);
         configure(earth1);
     });
     
     function addLayers(earth1) {
        earth1.addVisualizationStyleSheet('/vss/earth1-styles.vss');
        earth1.addMapItem({ layerType:'space', vssIdentifier: 'space', layerName: 'Space' });
        earth1.addMapItem({ layerType:'sphere', vssIdentifier: 'sphere', layerName: 'Oceans' });
        earth1.addMapItem({ layerType:'graticule', vssIdentifier: 'graticule-3-by-3',layerName: 'Graticule',  meridianFrequency:3, parallelFrequency:3, drawToPoles:false });
        earth1.addMapItem({ layerType:'gcs-package', vssIdentifier: 'land-110m', layerName: 'Land', url:'/natural-earth/land-110m.geojson', featureKey:'name' });
     }
     
     function configure(earth1) {
        earth1.setLatitude(12.98);
        earth1.setLongitude(77.58);
        earth1.setRotationSpeed(-1);
    }
</script>        
```


#### Configure the Component

The component can be configured by adding any of these optional attributes to
the `<rwt-orthographic-earth>` element tag.


<dl>
	<dt><code>geolocation</code> Used to set the initial latitude, longitude and place of interest.</dt>
	<dd>
		<ul>
			<li><code>''</code> [default] set initial longitude, latitude and place of interest to (0.0, 0.0) and honor explicit setTangentLongitude(), setTangentLatitude(), setPlaceOfInterest().</li>
			<li><code>'timezone'</code> use the browser's current time to determine the map's initial longitude.</li>
			<li><code>'auto'</code> use the browser's geolocation beacon to set initial longitude, latitude and place of interest.</li>
		</ul>
	</dd>
</dl>


<dl>
	<dt><code>menu-state</code> Used to set the initial state of the toolbar</dt>
	<dd>
		<ul>
			<li><code>closed</code> [default] The toolbar menu should initially be collapsed.</li>
			<li><code>open</code> The toolbar menu should initially be expanded.</li>
		</ul>
	</dd>
</dl>


<dl>
	<dt><code>menu-corner</code> Used to position the toolbar's location relative to the component's canvas area.</dt>
	<dd>
		<ul>
			<li><code>top-right</code> [default]</li>
			<li><code>top-left</code></li>
			<li><code>bottom-right</code></li>
			<li><code>bottom-left</code></li>
		</ul>
	</dd>
</dl>


<dl>
	<dt><code>panels</code> Declares the presence and order of menu panels.</dt>
	<dd>
		<ul>
			<li><code>interaction</code> Mouse gestures for manipulation and interaction.</li>
			<li><code>layers</code> Choose which layers to display.</li>
			<li><code>locate</code> Display longitude and latitude of mouse position.</li>
			<li><code>discover</code> Discover features a pointer position.</li>
			<li><code>identify</code> Identify underlying feature details.</li>
			<li><code>season</code> Change the reference date.</li>
			<li><code>time-of-day</code> Change the time of day.</li>
			<li><code>point-of-reference</code> Change the longitude/latitude of the observation point.</li>
			<li><code>equation-of-time</code> The variance between mean solar noon and actual solar noon.</li>
			<li><code>solar-events</code> The time of sunrise, solar noon, and sunset.</li>
			<li><code>geocentric-coords</code> The Earth's declination and right ascension for the current date and time.</li>
			<li><code>topocentric-coords</code> The position of the sun for the current location and time.</li>
			<li><code>zoom</code> Change the map's scale.</li>
			<li><code>space</code> Shift the space point of view.</li>
			<li><code>canvas</code> Shift the canvas origin.</li>
			<li><code>time-lapse</code> Rotate the Earth.</li>
			<li><code>hello-world</code> Licensing information.</li>
		</ul>
	</dd>
</dl>

#### Life-cycle events

The component issues life-cycle events.


<dl>
	<dt><code>component-loaded</code></dt>
	<dd>Sent when the component is fully loaded and ready to be used. As a convenience you can use the <code>waitOnLoading()</code> method which returns a promise that resolves when the <code>component-loaded</code> event is received. Call this asynchronously with <code>await</code>.</dd>
</dl>

### Metadata

#### Module exports


<table>
	<tr><td>ES modules</td> 		<td>true</td></tr>
	<tr><td>Common JS</td> 		<td>false</td></tr>
</table>

#### Suitability


<table>
	<tr><td>Browser</td> 			<td>API</td></tr>
	<tr><td>node.js</td> 			<td>none</td></tr>
</table>

#### Availability


<table>
	<tr><td><img src='/img/48x48/read-write-hub.png' alt='DOM components logo' width=48 /></td>	<td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/orthographic-earth.blue'>READ WRITE HUB</a></td></tr>
	<tr><td><img src='/img/48x48/git.png' alt='git logo' width=48 /></td>	<td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-orthographic-earth'>github</a></td></tr>
	<tr><td><img src='/img/48x48/dom-components.png' alt='DOM components logo' width=48 /></td>	<td>Component catalog</td> 	<td><a href='https://domcomponents.com/components/orthographic-earth.blue'>DOM COMPONENTS</a></td></tr>
	<tr><td><img src='/img/48x48/npm.png' alt='npm logo' width=48 /></td>	<td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-orthographic-earth'>npm</a></td></tr>
	<tr><td><img src='/img/48x48/read-write-stack.png' alt='Read Write Stack logo' width=48 /></td>	<td>Publication venue</td>	<td><a href='https://readwritestack.com/components/orthographic-earth.blue'>READ WRITE STACK</a></td></tr>
</table>

#### License

The <span>rwt-orthographic-earth</span> DOM component is not
freeware. After evaluating it and before using it in a public-facing website,
eBook, mobile app, or desktop application, you must obtain a license from <a href='https://readwritetools.com/licensing.blue'>Read Write Tools</a>
.

<img src='/img/blue-seal-premium-software.png' width=80 align=right />

<details>
	<summary>JavaScript Orthographic Earth Software License Agreement</summary>
	<p>Copyright © 2022 Read Write Tools.</p>
	<ol>
		<li>This Software License Agreement ("Agreement") is a legal contract between you and Read Write Tools ("RWT"). The "Materials" subject to this Agreement include the "JavaScript Orthographic Earth" software and associated documentation.</li>
		<li>By using these Materials, you agree to abide by the terms and conditions of this Agreement.</li>
		<li>The Materials are protected by United States copyright law, and international treaties on intellectual property rights. The Materials are licensed, not sold to you, and can only be used in accordance with the terms of this Agreement. RWT is and remains the owner of all titles, rights and interests in the Materials, and RWT reserves all rights not specifically granted under this Agreement.</li>
		<li>Subject to the terms of this Agreement, RWT hereby grants to you a limited, non-exclusive license to use the Materials subject to the following conditions:</li>
		<ul>
			<li>You may not distribute, publish, sub-license, sell, rent, or lease the Materials.</li>
			<li>You may not decompile or reverse engineer any source code included in the software.</li>
			<li>You may not modify or extend any source code included in the software.</li>
			<li>Your license to use the software is limited to the purpose for which it was originally intended, and does not include permission to extract, link to, or use parts on a separate basis.</li>
		</ul>
		<li>Each paid license allows use of the Materials under one "Fair Use Setting". Separate usage requires the purchase of a separate license. Fair Use Settings include, but are not limited to: eBooks, mobile apps, desktop applications and websites. The determination of a Fair Use Setting is made at the sole discretion of RWT. For example, and not by way of limitation, a Fair Use Setting may be one of these:</li>
		<ul>
			<li>An eBook published under a single title and author.</li>
			<li>A mobile app for distribution under a single app name.</li>
			<li>A desktop application published under a single application name.</li>
			<li>A website published under a single domain name. For this purpose, and by way of example, the domain names "alpha.example.com" and "beta.example.com" are considered to be separate websites.</li>
			<li>A load-balanced collection of web servers, used to provide access to a single website under a single domain name.</li>
		</ul>
		<li>THE MATERIALS ARE PROVIDED BY READ WRITE TOOLS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL READ WRITE TOOLS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</li>
		<li>This license is effective for a one year period from the date of purchase or until terminated by you or Read Write Tools. Continued use, publication, or distribution of the Materials after the one year period, under any of this Agreement's Fair Use Settings, is subject to the renewal of this license.</li>
		<li>Products or services that you sell to third parties, during the valid license period of this Agreement and in compliance with the Fair Use Settings provision, may continue to be used by third parties after the effective period of your license.</li>
		<li>If you decide not to renew this license, you must remove the software from any eBook, mobile app, desktop application, web page or other product or service where it is being used.</li>
		<li>Without prejudice to any other rights, RWT may terminate your right to use the Materials if you fail to comply with the terms of this Agreement. In such event, you shall uninstall and delete all copies of the Materials.</li>
		<li>This Agreement is governed by and interpreted in accordance with the laws of the State of California. If for any reason a court of competent jurisdiction finds any provision of the Agreement to be unenforceable, that provision will be enforced to the maximum extent possible to effectuate the intent of the parties and the remainder of the Agreement shall continue in full force and effect.</li>
	</ol>
</details>

#### Activation

To activate your license, copy the `rwt-registration-keys.js` file to the *root
directory of your website*, providing the `customer-number` and `access-key` sent to
your email address, and replacing `example.com` with your website's hostname.
Follow this example:

<pre>
export default [{
    "product-key": "rwt-orthographic-earth",
    "registration": "example.com",
    "customer-number": "CN-xxx-yyyyy",
    "access-key": "AK-xxx-yyyyy"
}]
</pre>

