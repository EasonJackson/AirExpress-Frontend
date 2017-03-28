package mytest;

import java.util.Date;

public class test {
	public String method(String arg) {
		return arg + "received";
	}

	public static int Print() {
		Date d = new Date();
		return d.hashCode();
	}

	public static String processRequest(String method, String[] params) {
		return "{" + "\"method\" : " + "\"" + method + "\"}";
	}
}