/// This is just a sample REST services router.
Class util.RestRouter Extends %CSP.REST
{
Parameter HandleCorsRequest=1;


XData UrlMap [ XMLNamespace = "http://www.intersystems.com/urlmap" ]
{
    <Routes>
      <Route Url="/books" Method="GET" Call="GetAllBooks" /> 
      <Route Url="/book/:id" Method="GET" Call="GetBook" /> 
      <Route Url="/books" Method="POST" Call="NewBook" /> 
      <Route Url="/book/:id" Method="PUT" Call="EditBook" /> 
      <Route Url="/book/:id" Method="DELETE" Call="DeleteBook"/>
   </Routes> 
}

/// Get a list of books. One can add a page number and number of items per page.
ClassMethod GetAllBooks() As %Status
{
  set tArr = []
  set rs = ##class(%SQL.Statement).%ExecDirect(,"SELECT * FROM book.Book")
  while rs.%Next() {
    do tArr.%Push({
      "id":              (rs.%Get("ID")),
      "title":           (rs.%Get("Title")),
      "author":          (rs.%Get("Author")),
      //"year":            (rs.%Get("Year")),
      "description":     (rs.%Get("Description"))
    })
  }
  
  write tArr.%ToJSON()
  quit $$$OK
}

/// Create a new book
ClassMethod NewBook() As %Status
{
  if '..GetJSONFromRequest(.obj) {
    set %response.Status = ..#HTTP400BADREQUEST
    set error = {"errormessage": "JSON not found"}
    write error.%ToJSON()
    quit $$$OK
  }
  
  set book = ##class(book.Book).%New()
  set book.Author=obj.author
  set book.Title=obj.title
  set book.Description=obj.description
  set sc=book.%Save()
  
  set result={}
  set result.Status=$s($$$ISERR(sc):$system.Status.GetOneErrorText(sc),1:"OK")
  set result.id=book.%Id()
  write result.%ToJSON()
  quit sc
}

/// Edit an existing book
ClassMethod EditBook(id As %String) As %Status
{
  if '..GetJSONFromRequest(.obj) {
    set %response.Status = ..#HTTP400BADREQUEST
    set error = {"errormessage": "JSON not found"}
    write error.%ToJSON()
    quit $$$OK
  }


  set book = ##class(book.Book).%OpenId(obj.id)
  if '$IsObject(book) {
    set %response.Status = ..#HTTP204NOCONTENT
    quit $$$OK
  }
  set book.Author=obj.author
  set book.Title=obj.title
  set book.Description=obj.description
  set sc=book.%Save()
  
  set result={}
  set result.Status=$s($$$ISERR(sc):$system.Status.GetOneErrorText(sc),1:"OK")
  set result.id=book.%Id()
  write result.%ToJSON()
  quit sc
}

/// Delete book
ClassMethod DeleteBook(id As %String) As %Status
{

  set sc = ##class(book.Book).%DeleteId(id)
  
  set result={}
  set result.Status=$s($$$ISERR(sc):$system.Status.GetOneErrorText(sc),1:"OK")
  write result.%ToJSON()
  quit sc
}

ClassMethod GetJSONFromRequest(ByRef obj As %DynamicObject)  As %Boolean
{
	set ok = 1
	try {
		set obj = ##class(%DynamicObject).%FromJSON(%request.Content)
	} catch ex {
		set ok = 0
	}
	quit ok
}

ClassMethod GetBook(id As %String) As %Status {
	set book = ##class(book.Book).%OpenId(id)
	if '$IsObject(book) {
		set %response.Status = ..#HTTP204NOCONTENT
		quit $$$OK
	}
	set obj = {
		"id": (book.%Id()),
		"author": (book.Author),
		"title": 		(book.Title),
		"description":        (book.Description)
	}
	write obj.%ToJSON()
	quit $$$OK	
}

}