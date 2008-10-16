package edu.berkeley.gcweb;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Iterator;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * A thread-safe implementation of a two-way mapping between game names that 
 * are internal to Gamesman (e.g., ttt) and their canonical names (e.g., 
 * Tic-Tac-Toe). Mappings are read from a simple XML file that may be passed 
 * to this class's constructor.
 * @author Ide
 */
public class GameDictionary {
    private Map<String, String> internalToCanonical;
    private Map<String, String> canonicalToInternal;
    private DocumentBuilder domBuilder;
    
    public GameDictionary() throws ParserConfigurationException {
        internalToCanonical = new HashMap<String, String>();
        canonicalToInternal = new HashMap<String, String>();
        
        DocumentBuilderFactory domFactory = 
            DocumentBuilderFactory.newInstance();
        domFactory.setNamespaceAware(true);
        domFactory.setIgnoringComments(true);
        domBuilder = domFactory.newDocumentBuilder();
    }
    
    public GameDictionary(URL xml) throws 
            ParserConfigurationException, IOException {
        this();
        unmarshal(xml);
    }
    
    public void marshal(File xmlFile) throws IOException {
        try {
            Document xmlDocument;
            synchronized (domBuilder) {
                xmlDocument = domBuilder.newDocument();
            }
            
            Element rootElement = xmlDocument.createElement("game-dictionary");
            xmlDocument.appendChild(rootElement);
            
            synchronized (this) {
                Iterator<String> internalNames = 
                    internalToCanonical.keySet().iterator();
                while (internalNames.hasNext()) {
                    String internalName = internalNames.next();
                    String canonicalName = getCanonicalName(internalName);
                    Element gameElement = xmlDocument.createElement("game");
                    gameElement.setAttribute("internal-name", internalName);
                    gameElement.setAttribute("canonical-name", canonicalName);
                    rootElement.appendChild(gameElement);
                }
            }
            
            TransformerFactory transformFactory = 
                TransformerFactory.newInstance();
            Transformer transformer = transformFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            
            Source xmlSource = new DOMSource(xmlDocument);
            Result xmlOutput = new StreamResult(xmlFile);
            transformer.transform(xmlSource, xmlOutput);
        } catch (TransformerException e) {
            throw new IOException(e.getMessage());
        }
    }
    
    public void unmarshal(URL xml) throws IOException {
        InputStream xmlStream = null;
        try {
            Document xmlDocument;
            xmlStream = xml.openStream();
            synchronized (domBuilder) {
                xmlDocument = domBuilder.parse(xmlStream);
            }
            
            XPathFactory xpathFactory = XPathFactory.newInstance();
            XPath xpath = xpathFactory.newXPath();
            XPathExpression query = xpath.compile("//game");
            NodeList gameNodes = (NodeList)query.evaluate(
                xmlDocument, XPathConstants.NODESET);
            
            for (int i = 0; i < gameNodes.getLength(); i++) {
                Node game = gameNodes.item(i);
                NamedNodeMap attributes = game.getAttributes();
                Node internalNode = attributes.getNamedItem("internal-name");
                Node canonicalNode = attributes.getNamedItem("canonical-name");
                if (internalNode != null && canonicalNode != null) {
                    String internalName = internalNode.getNodeValue();
                    String canonicalName = canonicalNode.getNodeValue();
                    addMapping(internalName, canonicalName);
                }  
            }
        } catch (SAXException e) {
            throw new IOException(e.getMessage());
        } catch (XPathExpressionException e) {
            throw new IOException(e.getMessage());
        } finally {
            if (xmlStream != null) {
                xmlStream.close();
            }
        }
    }
    
    public synchronized void addMapping(String internal, String canonical) {
        internalToCanonical.put(internal, canonical);
        canonicalToInternal.put(canonical, internal);
    }
    
    public synchronized void removeMappingByInternalName(String internalName) {
        String canonicalName = getCanonicalName(internalName);
        if (canonicalName != null) {
            assert internalName.equals(getInternalName(canonicalName)) : 
                "Canonical-to-internal mapping exists but " + 
                "internal-to-canonical mapping does not.";
            internalToCanonical.remove(internalName);
            canonicalToInternal.remove(canonicalName);
        }
    }
    
    public synchronized void removeMappingByCanonicalName(String canonicalName) {
        String internalName = getInternalName(canonicalName);
        if (internalName != null) {
            assert canonicalName.equals(getCanonicalName(internalName)) : 
                "Internal-to-canonical mapping exists but " + 
                "canonical-to-internal mapping does not.";
            canonicalToInternal.remove(canonicalName);
            internalToCanonical.remove(internalName);
        }
    }
    
    public synchronized String getCanonicalName(String internalName) {
        String canonicalName = null;
        if (internalToCanonical.containsKey(internalName)) {
            canonicalName = internalToCanonical.get(internalName);
        }
        return canonicalName;
    }
    
    public synchronized String getInternalName(String canonicalName) {
        String internalName = null;
        if (canonicalToInternal.containsKey(canonicalName)) {
            internalName = canonicalToInternal.get(canonicalName);
        }
        return internalName;
    }
    
    public synchronized String[] getCanonicalNames() {
        Set<String> keys = canonicalToInternal.keySet();
        String[] names = new String[keys.size()];
        keys.toArray(names);
        return names;
    }
    
    @Override
    public String toString() {
        StringBuilder description = new StringBuilder();
        description.append("GameDictionary ");
        String[] internalNames;
        synchronized (this) {
            internalNames = internalToCanonical.keySet().toArray(new String[0]);
        }
        description.append('{');
        for (int i = 0; i < internalNames.length; i++) {
            if (i > 0) {
                description.append(", ");
            }
            String internalName = internalNames[i];
            String canonicalName = getCanonicalName(internalName);
            description.append(internalName + "=" + canonicalName);
        }
        description.append('}');
        return description.toString();
    }
}
