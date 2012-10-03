(:~
: test display of images via restxq
: @author andy bunce
: @since aug 2012
:)
module namespace page = 'apb.imagetest';
import module namespace session = "http://basex.org/modules/session";
declare namespace rest = 'http://exquery.org/ns/restxq';

(:~
: write uploaded file to disk
:)
declare %rest:path("upload")
%rest:POST("{$body}")
%restxq:header-param("Content-Type", "{$Content-Type}")
%restxq:header-param("UP-FILENAME", "{$filename}")
%restxq:header-param("UP-SIZE", "{$size}")
%restxq:header-param("UP-TYPE", "{$type}")
function page:test($Content-Type,$body,$filename,$type,$size) {
  let $is-string:=contains($type,"text") or contains($type,"xml")
  let $p:=if($is-string)
          then convert:binary-to-string(xs:base64Binary($body))
		  else convert:binary-to-bytes(xs:base64Binary($body))
  let $path:=resolve-uri("files/" || $filename)		  
  let $junk:=if($is-string)
             then  file:write-text($path,$p)
             else  file:write-binary($path,convert:bytes-to-hex($p)) 			 
  return ("ok",$path,$size)
 };
 
