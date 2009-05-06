package edu.berkeley.gcweb.tests;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.fail;

import java.io.File;
import java.io.IOException;

import org.junit.Before;
import org.junit.Test;

import edu.berkeley.gcweb.GameDictionary;

public class GameDictionaryTest {
    private GameDictionary dictionary;
    
    @Before
    public void setUpBefore() throws Exception {
        dictionary = new GameDictionary();
    }

    @Test
    public void testMarshal() {
        try {
            File xmlFile = new File("marshal-test.xml");
            try {
                testAddMapping();
                dictionary.marshal(xmlFile);
                dictionary.unmarshal(xmlFile.toURI().toURL());
                assertNotNull("Achi not entered into dictionary.", 
                    dictionary.getInternalName("Achi"));
                assertNotNull("achi not entered into dictionary.", 
                    dictionary.getCanonicalName("achi"));
            } catch (IOException e) {
                fail("IOException occurred during unmarshalling: " + 
                    e.getMessage());
            } finally {
            	if (!xmlFile.delete()) {
            		xmlFile.deleteOnExit();
            	}
            }
        } catch (Exception e) {
            fail("Syntactically illegal URI specified: " + e.getMessage());
        }
    }

    @Test
    public void testUnmarshal() {
        try {
            dictionary.unmarshal(
                new File("WEB-INF/dictionary.xml").toURI().toURL());
            assertNotNull("Tic-Tac-Toe not entered into dictionary.", 
                dictionary.getInternalName("Tic-Tac-Toe"));
        } catch (IOException e) {
            fail("IOException occurred during unmarshalling: " + 
                e.getMessage());
        }
    }

    @Test
    public void testAddMapping() {
//        String internalName = "achi";
//        String canonicalName = "Achi";
//        dictionary.addMapping(internalName, canonicalName);
//        assertNotNull("No canonical name for " + internalName + " exists.", 
//            dictionary.getCanonicalName(internalName));
//        assertNotNull("No internal name for " + canonicalName + " exists.", 
//            dictionary.getInternalName(canonicalName));
    }

    @Test
    public void testRemoveMappingByInternalName() {
        testUnmarshal();
        testAddMapping();
        dictionary.removeMappingByInternalName("connectfour");
        dictionary.removeMappingByInternalName("achi");
        assertNull("connectfour not removed from dictionary.", 
            dictionary.getCanonicalName("connectfour"));
        assertNull("achi not removed from dictionary.", 
            dictionary.getCanonicalName("achi"));
    }

    @Test
    public void testRemoveMappingByCanonicalName() {
        testUnmarshal();
        testAddMapping();
        dictionary.removeMappingByCanonicalName("Connect Four");
        dictionary.removeMappingByCanonicalName("Achi");
        assertNull("Connect Four not removed from dictionary.", 
            dictionary.getInternalName("Connect Four"));
        assertNull("Achi not removed from dictionary.", 
            dictionary.getCanonicalName("Achi"));
    }
}
