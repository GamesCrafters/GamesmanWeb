package edu.berkeley.gcweb.servlet.gctl;

import java.io.IOException;

import javax.servlet.jsp.tagext.TagSupport;

public class DropdownTag extends TagSupport {

    private String name;
    private Object[] options;

    public void setName(String name) {
	this.name = name;
    }

    public String getName() {
	return name;
    }

    public void setOptions(Object[] options) {
	this.options = options;
    }

    public Object[] getOptions() {
	return options;
    }

    protected void println(String s) {
        try {
            pageContext.getOut().println(s);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    protected String strip(String s) {
	return (s == null) ? "": s.trim();
    }

    protected String escape(Object raw) {
	String str = String.valueOf(raw);
	return str.replace("&", "&amp;").replace("<", "&lt;")
	          .replace(">", "&gt;").replace("\"", "&quot;");
    }

    @Override
    public int doStartTag() {
	String id = strip(getId());
	String name = strip(getName());
	StringBuilder tag = new StringBuilder("<select");
	if (id.length() > 0) {
	    tag.append(" id=\"" + escape(id) + "\"");
	}
	if (name.length() > 0) {
	    tag.append(" name=\"" + escape(name) + "\"");
	}
	tag.append(">");
	println(tag.toString());

	if (getOptions() != null) {
	    for (Object o : getOptions()) {
		println("  <option>" + escape(o) + "</option>");
	    }
	}

	println("</select>");
        return SKIP_BODY;
    }
}
